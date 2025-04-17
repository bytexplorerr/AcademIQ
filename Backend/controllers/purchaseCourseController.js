import Stripe from "stripe";
import courseModel from "../models/courseModel.js";
import purchaseCourseModel from "../models/purchaseCourseModel.js";
import lectureModel from "../models/lectureModel.js";
import userModel from "../models/userModel.js";
import courseProgressModel from "../models/courseProgressModel.js";
import { CourseEnrolledMailView } from "../services/mailService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req,res) => {
    try {

        const {_id} = req.user;
        const {courseID} = req.body;

        const course = await courseModel.findById(courseID);

        if(!course) {
            return res.status(404).json({success:false,message:'Course Not Found!'});
        }

        const newPurchase = await purchaseCourseModel.create({
            courseID,
            userID:_id,
            amount:course?.price || 0,
        });

        if(!course.price || course.price === 0) {
            if(course.lectures.length > 0){
                await lectureModel.updateMany(
                    {_id:{$in:course.lectures}},
                    {$set:{isPreviewFree:true}},
                )
            }

            await userModel.findByIdAndUpdate(_id,
                {$addToSet:{enrolledCourses:courseID}},
            );

            await courseModel.findByIdAndUpdate(courseID,
                {$addToSet:{enrolledStudents:_id}},
            );
            newPurchase.status = 'completed';

            const user = await userModel.findById(_id);

            await CourseEnrolledMailView({
                userName:user.name,
                emailID:user.email,
                courseID:courseID,
                title:course.title,
            });

            await newPurchase.save();

            const lectureProgress = course.lectures.map((lecture)=> ({lectureID:lecture._id}));

            await courseProgressModel.create({
                courseID,
                userID:_id,
                lectureProgress,
            });

            return res.status(200).json({success:true,message:'Course Purchased Successfully!'});
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:[
                {
                    price_data:{
                        currency:'inr',
                        product_data:{
                            name:course.title,
                            images:[course?.thumbnail || 'https://as1.ftcdn.net/v2/jpg/02/68/55/60/1000_F_268556011_PlbhKss0alfFmzNuqXdE3L0OfkHQ1rHH.jpg']
                        },
                        unit_amount:(course?.price || 0) * 100,
                    },
                    quantity:1,
                }
            ],
            mode:'payment',
            success_url:`${process.env.CLIENT_URL}/course-progress/${course._id}`,
            cancel_url:`${process.env.CLIENT_URL}/course-details/${course._id}`,
            metadata:{
                courseID:courseID.toString(),
                userID:_id.toString(),
            },
            shipping_address_collection:{
                allowed_countries:['IN'],
            }
        });

        if(!session.url) {
            return res.status(400).json({success:false,message:'Error while creating the session!'});
        }

        newPurchase.paymentID = session.id;
        await newPurchase.save();

        return res.status(200).json({success:true,url:session.url})

    } catch(err) {
        console.log(err);
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const stripeWebhook = async (req,res) => {
    let event;
    try {
        const payloadString = JSON.stringify(req.body,null,2);
        const secret = process.env.WEBHOOK_ENPOINT_SECRET;

        const header = stripe.webhooks.generateTestHeaderString({
            payload:payloadString,
            secret,
        });

        event = stripe.webhooks.constructEvent(payloadString,header,secret);

    } catch(err) {
        console.log(err);
        return res.status(500).json({success:false,message:'Internal server error!'});
    } 

    if(event.type === 'checkout.session.completed') {
        try {
            const session = event.data.object;

            const purchase = await purchaseCourseModel.findOne({paymentID:session.id}).populate('courseID').populate({path:'userID',select:'name email'});

            if(!purchase) {
                return res.status(404).json({success:false,message:'Purchase Not Found!'});
            }

            if(session.amount_total) {
                purchase.amount = session.amount_total / 100;
            }

            purchase.status = 'completed';

            if(purchase.courseID && purchase.courseID.lectures.length > 0) {
                await lectureModel.updateMany(
                    {_id:{$in:purchase.courseID.lectures}},
                    {$set:{isPreviewFree:true}},
                )
            }

            await CourseEnrolledMailView({
                userName:purchase.userID.name,
                emailID:purchase.userID.email,
                courseID:purchase.courseID._id,
                title:purchase.courseID.title,
            });

            await purchase.save();

            await userModel.findByIdAndUpdate(purchase.userID,
                {$addToSet:{enrolledCourses:purchase.courseID._id}},
            );

            await courseModel.findByIdAndUpdate(purchase.courseID,
                {$addToSet:{enrolledStudents:purchase.userID}},
            );

            const lectureProgress = purchase.courseID.lectures.map((lecture)=>({lectureID:lecture._id}));

            await courseProgressModel.create({
                courseID:purchase.courseID._id,
                userID:purchase.userID,
                lectureProgress,
            });

        } catch(err) {
            console.log(err);
           return res.status(500).json({success:false,message:'Internal server error!'});
        }
    }
    res.status(200).send();
}

export const GetPurchasedCourses = async (req,res) => {
    try {

        const {_id,role} = req.user;

        if(role !== 'instructor') {
            return res.status(401).json({success:'false',message:'Unauthorized!'});
        }

        const purchasedCoures = await purchaseCourseModel.find({status:'completed'}).populate({path:'courseID',match:{creator:_id},select:'title price creator'});
        
        const courseData = purchasedCoures.map((course)=>{
            return {
                name:course?.courseID?.title,
                price:course?.courseID?.price || 0,
            }
        });

        return res.status(200).json({success:true,courseData});

    } catch(err) {
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}

export const FetchPurchaseStatus = async (req,res) => {
    try {
        const {_id} = req.user;
        const {courseID} = req.params;
        
        const purchase = await purchaseCourseModel.findOne({courseID,userID:_id});

        if(!purchase) {
            return res.status(404).json({success:false,message:'Purchase Not Found!'});
        }

        return res.status(200).json({success:true,status:purchase.status});

    } catch(err) {
        return res.status(500).json({success:false,message:'Internal server error!'});
    }
}