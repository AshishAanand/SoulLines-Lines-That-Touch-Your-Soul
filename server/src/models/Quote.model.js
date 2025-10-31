import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  tag: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: [
    {
      text: String,
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      date: { type: Date, default: Date.now },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;
