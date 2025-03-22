import mongoose from 'mongoose';

const SalerSchema = new mongoose.Schema({
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
    address: {
        country: { type: String },
        city: { type: String },
        street: { type: String },
        postalCode: { type: String, default: "0000" },
    },
    profileImage: {
        type: String,
    },
    productVisitedBy: {
        type: Number,
        default: 0, // Tracks the number of views
    },
    storeName: {
        type: String,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, { timestamps: true });

export default mongoose.model('Saler', SalerSchema);
