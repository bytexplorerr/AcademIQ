import express from "express"
import { authUser } from "../middlewares/auhMiddleware.js";
import { createCheckoutSession, FetchPurchaseStatus, GetPurchasedCourses, stripeWebhook } from "../controllers/purchaseCourseController.js";

const purchaseRouter = express.Router();

purchaseRouter.post("/checkout/create-checkout-session",authUser,createCheckoutSession);
purchaseRouter.post("/webhook",express.raw({type:"application/json"}),stripeWebhook);
purchaseRouter.get("/sales-info",authUser,GetPurchasedCourses);
purchaseRouter.get("/status/:courseID",authUser,FetchPurchaseStatus);

export default purchaseRouter;