import mongoose from "mongoose";

const userOTPverificationSchema = new mongoose.Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
});


const userOTPverification = mongoose.model(

    "userOTPverification",
    userOTPverificationSchema
);

export default userOTPverification;