import mongoose, { Schema } from "mongoose";
import bycrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trime: true
    },
    fullname: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true
    },
    coverImage: {
        type: String
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ]
}, { timestamps: true })

userSchema.plugin(aggregatePaginate);

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bycrypt.hash(this.password, 10);
    next()
});

userSchema.methods.isPasswordValid = async function
    (password) {
    return bycrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    const token = jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname
    }, process.env.ACCESSTOKEN_SECRET,
        {
            expiresIn: process.env.ACCESSTOKEN_EXPIRY
        })
    return token;
}


userSchema.methods.generateRefreshToken = function () {
    const token = jwt.sign({
        id: this._id,
        username: this.username,
        email: this.email,
        fullname: this.fullname
    }, process.env.REFRESHTOKEN_SECRET,
        {
            expiresIn: process.env.REFRESHTOKEN_EXPIRY
        })
    return token;
}

export const User = mongoose.model("User", userSchema);