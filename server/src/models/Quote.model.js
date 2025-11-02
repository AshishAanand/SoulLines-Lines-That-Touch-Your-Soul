import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  tag: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;
