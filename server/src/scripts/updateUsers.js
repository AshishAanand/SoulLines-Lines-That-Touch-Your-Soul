import mongoose from "mongoose";
import dotenv from "dotenv";
import User from '../models/User.model.js';

dotenv.config();

const updateUsers = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.init(); // builds indexes declared in schema
  console.log("Indexes created");

  mongoose.disconnect();
};

updateUsers();