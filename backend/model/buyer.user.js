import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: /^\+?[1-9]\d{1,14}$/,
    },
    history: {
        type: Object,
        
    },
    favourites:{
        productId:[],
        count:{type:Number,default:0}


    },
    profileImage: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    username: {
        type: String,
        unique: true,
        default:""
    },
    preferences: {
        type: Object,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    activityLogs: {
        type: Array,
        default: [],
    },
    referralCode: {
        type: String,
        default:"0303"
    },
});

export default mongoose.model("Buyer", userSchema);