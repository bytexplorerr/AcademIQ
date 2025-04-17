import dotenv from "dotenv";
dotenv.config();
import express from "express"
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import connectTODB from "./db/db.js";
import passport from "passport";
import {userRouter} from "./routes/userRoutes.js";
import {courseRouter} from "./routes/courseRoutes.js";
import lectureRouter from "./routes/lectureRoutes.js";
import purchaseRouter from "./routes/purchaseCourseRoutes.js";
import certificateRouter from "./routes/certificateRoutes.js";
import courseProgressRouter from "./routes/courseProgressRoutes.js";
import oAuthRouter from "./routes/oAuthRoutes.js";

const app = express();

connectTODB();


app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
    allowedHeaders:['Content-Type','Authorization'],
    methods:['GET','PUT','POST','DELETE','OPTIONS','PATCH']
}));

app.use(express.urlencoded({extended:true}));

app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        secure:false,
        sameSite:'Lax',
        expires:new Date(Date.now() + 24 * 60 * 60 * 1000),
    }
}))


app.use("/users",userRouter);
app.use("/courses",courseRouter);
app.use("/lectures",lectureRouter);
app.use("/purchase",purchaseRouter);
app.use("/certificate",certificateRouter);
app.use("/progress",courseProgressRouter);
app.use("/auth",oAuthRouter);

export default app;