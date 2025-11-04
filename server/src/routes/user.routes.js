import express from 'express';
import  protect from '../middlewares/auth.middleware.js';
import { registerUser, loginUser, getUserProfile, logoutUser, getUserByUsername } from '../controllers/user.controllers.js';

// Initialize router
const router = express.Router();

// User registration route
router.post('/register', registerUser);
// User login route
router.post('/login', loginUser);
// User profile route (protected)
router.get('/profile', protect, getUserProfile);

router.get("/:username", getUserByUsername);  // 👈 Add this line
// User logout route (protected)
router.post('/logout', protect, logoutUser);


export default router;