// import jwt from 'jsonwebtoken';
// import User from '../models/User.model.js';
// import TokenBlacklist from '../models/tokenBlacklist.model.js';

// const protect = async (req, res, next) => {

//     let token;

//     if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//     ) {
//         try {

//             token = req.headers.authorization.split(' ')[1];
//             console.log("Token:", token);

//             // Check if token is blacklisted
//             const blacklisted = await TokenBlacklist.findOne({ token });
//             console.log("Blacklisted:", blacklisted);

//             if (blacklisted) {
//                 return res.status(401).json({ message: "Token has been revoked", status: 401 });
//             }

//             // Verify token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             console.log("Decoded:", decoded);
//             // Get user from the token

//             user = await User.findById(decoded.id).select('-password');
//             console.log("👤 User found:", user ? user.email : "❌ No user found");

//             req.user = user;

//             next();

//         } catch (error) {
//             res.status(401).json({ message: 'Not authorized, token failed', status: 401 });
//         }
//     }

//     if (!token) {
//         res.status(401).json({ message: 'Not authorized, no token', status: 401 });
//     }

// };

// export default protect;


import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import TokenBlacklist from "../models/tokenBlacklist.model.js";

const protect = async (req, res, next) => {
  try {
    // Check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    // Check if blacklisted
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token revoked" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("❌ No user found with decoded ID");
      return res.status(401).json({ message: "User not found, invalid token" });
    }

    // Attach user
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
