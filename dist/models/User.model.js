import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    drones: [{ type: mongoose.Schema.ObjectId, ref: "Drone" }],
    refreshToken: { type: String },
}, {
    timestamps: true,
});
UserSchema.methods.generateAccessToken = function () {
    const payload = {
        // this._id this is come from the mongoDB
        _id: this._id,
        username: this.username,
        email: this.email,
    };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
};
UserSchema.methods.generateRefreshToken = function () {
    const payload = {
        _id: this._id,
    };
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};
export const User = mongoose.model("User", UserSchema);
