import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({

    text: {
        type: String, required: true
    },
    author: {
        type: String, default: "Anonymous"
    },
    tags: {
        type: [String],
        default: [],
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            text: String,
            user: String,
            date: { type: Date, default: Date.now},
        },
    ],
    
}, {timestamps: true});

const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;