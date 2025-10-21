import mongoose from "mongoose";

// Connect to MongoDB

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.info(`MongoDB connected: ${connection.connection.host}`);
    console.log("MongoDB connected successfully");
  }
    catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
    }
};

// Disconnect from MongoDB

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully");
  }
  catch (error) {
    console.error("MongoDB disconnection error:", error);
  }
};


export {connectDB, disconnectDB};