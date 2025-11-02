import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import cookieParser from 'cookie-parser';
import generateToken from '../utils/generateToken.js';
import TokenBlacklist from '../models/tokenBlacklist.model.js';

/**
 * @desc Register a new user
 * @route POST /api/users/register
 * @access Public
 */
const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Basic validation
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' }); // 409 = conflict
        }

        // Create user (password hashing handled in model pre-save middleware)
        const newUser = await User.create({ name, username, email, password });

        await newUser.save();

        // Respond with token and user details
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email
            },
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * @desc Login user & get token
 * @route POST /api/users/login
 * @access Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        console.log("User found during login:", user); // return null ( This is the issue )
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Match password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        // Success response
        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                token: token,
            },
        });

        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS in production
            maxAge: 3600000, // Cookie expiration in milliseconds (e.g., 1 hour)
            sameSite: 'Lax' // Or 'Strict' or 'None' depending on your requirements
        });


    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

/**
 * @desc Get user profile (Protected)
 * @route GET /api/users/profile
 * @access Private
 */
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Profile Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const logoutUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({ message: "No token provided", status: 400 });
        }

        const token = authHeader.split(" ")[1];

        // Store the token in the blacklist
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.exp) {
            return res.status(400).json({ message: "Invalid token", status: 400 });
        }

        const expiry = new Date(decoded.exp * 1000);

        await TokenBlacklist.create({
            token,
            expiresAt: expiry,
        });

        res.status(200).json({ message: "User logged out successfully", status: 200 });
    } catch (error) {
        console.error("Logout Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message, status: 500 });
    }
};

/**
 * @desc follow user
 * @route POST /api/users/:id/follow
 * @access public
 */


const followUser = async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!targetUser || !currentUser)
            return res.status(404).json({ msg: "User not found" });

        const alreadyFollowing = currentUser.following.includes(targetUser._id);

        if (alreadyFollowing) {
            currentUser.following.pull(targetUser._id);
            targetUser.followers.pull(currentUser._id);
        } else {
            currentUser.following.push(targetUser._id);
            targetUser.followers.push(currentUser._id);
        }

        await currentUser.save();
        await targetUser.save();

        res.json({ following: currentUser.following, followers: targetUser.followers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { registerUser, loginUser, getUserProfile, logoutUser, followUser };
