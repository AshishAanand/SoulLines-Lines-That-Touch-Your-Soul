import mongoose from "mongoose";
import dotenv from "dotenv";
import User from '../models/User.model.js';

dotenv.config();

const updateUsers = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const users = await User.findOne({ _id: "6904f460e670fb91be0a1757" })
  .then(result => console.log(result))
  .catch(err => console.error(err));

  mongoose.disconnect();
};

updateUsers();
// import User from "../models/User.model.js";

// const check = async () => {await User.findOne({ _id: "68fc77ecebce6a53409d20e3" })
//   .then(result => console.log(result))
//   .catch(err => console.error(err));}

// check();

