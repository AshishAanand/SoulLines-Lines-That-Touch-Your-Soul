import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // <— best practice for security
    },
  },
  { timestamps: true }
);

// Encrypt password before saving

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) { // this.password only gets hashed if it has been modified
        return next();
    }
    const salt = await bcrypt.genSalt(10); // higher number means more secure but slower
    this.password = await bcrypt.hash(this.password, salt); // hash the password
    next(); // proceed to save the user
});


// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;