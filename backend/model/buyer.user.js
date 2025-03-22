import mongoose from 'mongoose';

// Define the schema
const electronicsProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    model: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    category: {
        type: String,
        required: true,
    },
    spec: {
        type: Map, // Flexible structure for product specifications
        of: String,
    },
    productDate: {
        type: Date,
        default: Date.now, // Sets the current date as default
    },
    salerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Saler', // References the Saler collection
        required: true,
    },
    likes: {
        count: {
            type: Number,
            default: 0 // Keeps track of the number of likes
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Buyer' // References the Buyer collection
            }
        ],
    },
    views: {
        count: {
            type: Number,
            default: 0 // Keeps track of the number of views
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Buyer' // References the Buyer collection
            }
        ],
    },
    comments: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Buyer' // References the Buyer collection
            },
            text: {
                type: String,
                required: true // Content of the comment
            },
            timestamp: {
                type: Date,
                default: Date.now // Time when the comment was posted
            }
        }
    ],
    recommendationStatus: {
        type: Number,
        enum: [0, 1, 2], // Example: 0 = Not Recommended, 1 = Recommended, 2 = Highly Recommended
    },
    stock: {
        type: Number,
        required: true,
        default: 0, // Tracks product stock quantity
    },
    discount: {
        type: Number, // Percentage discount (e.g., 10 for 10%)
        default: 0,
    },
    finalPrice: {
        type: Number, // Price after applying the discount
    },
    images: [{
        type: String, // Array of image URLs
    }],
    tags: [{
        type: String, // Keywords for filtering and search
    }],
    description: {
        type: String, // Detailed description of the product
    },
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 }, // Average rating
        count: { type: Number, default: 0 }, // Total number of ratings
    },
}, { timestamps: true });

export default mongoose.model('ElectronicsProduct', electronicsProductSchema);
