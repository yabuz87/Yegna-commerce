import mongoose from "mongoose";

const ElectronicsProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    spec: { type: Map, of: mongoose.Schema.Types.Mixed }, // Flexible specs
    productDate: { type: Date, default: Date.now },
    views: {
        count: { type: Number, default: 0 }, // Tracks the total number of views
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Buyer", // Reference to the Buyer collection
                unique:true
            },
        ],
    },
    likes: {
        users: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer",unique:true},
                timestamp: { type: Date, default: Date.now }, // Tracks when the user liked
            },
        ],
        count: { type: Number, default: 0 }, // Denormalized count of likes
    },
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer" },
            text: { type: String, required: true }, // Content of the comment
            timestamp: { type: Date, default: Date.now }, // When the comment was posted
        },
    ],
    salerId: { type: mongoose.Schema.Types.ObjectId, ref: "Saler" },
    recommendationStatus: {
        type: Number,
        enum: [0, 1, 2], // 0: Not Recommended, 1: Recommended, 2: Highly Recommended
    },
    interactionCounts: { // Quick access for totals
        likes: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
    },
}, { timestamps: true });

export default mongoose.model("ElecrtonicsProduct",ElectronicsProductSchema);