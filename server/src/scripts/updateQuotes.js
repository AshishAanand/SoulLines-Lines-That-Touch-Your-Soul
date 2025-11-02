import mongoose from "mongoose";
import dotenv from "dotenv";
import Quote from '../models/Quote.model.js';

dotenv.config();

const updatePosts = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const quote = await Quote.find();
  for (let post of quote) {
    post.likes = post.likes || [];
    post.comments = post.comments || [];
    await post.save();
    console.log(`✅ Updated post: ${post._id}`);
  }

  console.log("🎯 All quote updated successfully!");
  mongoose.disconnect();
};

updatePosts();
