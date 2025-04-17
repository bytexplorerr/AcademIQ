import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});


// Media can be anything like images, videos, audios etc.
export const uploadMedia = async (file)=>{
    try {
        const response = await cloudinary.uploader.upload(file,{
            resource_type:'auto'
        });
        return response;
    } catch(err) {
        console.log(err);
    }
}

// every media has 'publicID' in cloudinary
export const deleteMedia = async (publicID)=>{
    try { 
        await cloudinary.uploader.destroy(publicID);
    } catch(err) {
        console.log(err);
    }
}