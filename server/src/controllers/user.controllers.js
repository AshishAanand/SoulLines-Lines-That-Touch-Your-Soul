import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';

//  @desc Register a new user
//  @route POST /api/users/register

const registerUser = async (req, res) => {
    try {

        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists', status: 400 });
        }

        // Create new user
        const newUser = new User({ username, email, password });

        // generate token

        if (newUser) {
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                token: generateToken(newUser._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data', status: 400 });
        }

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser, status: 201 });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message, status: 500 });
    }
};

// @desc Login user & get token
// @route POST /api/users/login

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password', status: 401 });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message, status: 500 });
    }
};


// @desc Get user profile ( protected route )
// @route GET /api/users/profile

const getUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found', status: 404 });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message, status: 500 });
    }
};

export { registerUser, loginUser, getUserProfile };