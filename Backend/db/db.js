import mongoose from "mongoose";

const connectTODB = ()=>{
    mongoose.connect(process.env.DB_CONNECTION).then(()=>{
        console.log('Connected to DB');
    }).catch(err => console.log(err));
}

export default connectTODB;