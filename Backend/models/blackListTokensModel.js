import mongoose from "mongoose";

const blackListModelSchema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true,
    },
    expiresAt:{
        type:Date,
        default:new Date(Date.now() + 24 * 60 * 60 * 1000),
        index:{expires:864000}
    }
})

blackListModelSchema.index({expiresAt:1},{expireAfterSeconds:864000});

const blackListModel = mongoose.models.BlackListTokens || mongoose.model('BlackListTokens',blackListModelSchema);

export default blackListModel;