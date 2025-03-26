import mongoose from "mongoose";

const ElectronicsProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    spec: { type: Map, of: mongoose.Schema.Types.Mixed }, // Flexible specs
    productDate: { type: Date, default: Date.now },
    views: {
    users: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer" },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    count: { type: Number, default: 0 },
},
    likes: {
        users: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer",unique:true},
                timestamps: { type: Date, default: Date.now }, // Tracks when the user liked
            },
        ],
        count: { type: Number, default: 0 }, // Denormalized count of likes
    },
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer" },
            text: { type: String, required: true }, // Content of the comment
            timestamps: { type: Date, default: Date.now }, // When the comment was posted
        },
    ],
    salerId: { type: mongoose.Schema.Types.ObjectId, ref: "Saler",unique:false},
    recommendationStatus: {
        type: Number,
        enum: [0, 1, 2], // 0: Not Recommended, 1: Recommended, 2: Highly Recommended
    },
    placment:{
        type: String,
        enum: ["sold","not sold", "on process"],
        default:"not sold",
    },
    interactionCounts: { // Quick access for totals
        likes: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
    },
    image:{
        photo:[]
    }
}, { timestamps: true });

export default mongoose.model("ElecrtonicsProduct",ElectronicsProductSchema);