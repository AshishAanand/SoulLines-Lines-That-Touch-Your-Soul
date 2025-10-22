import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/user.controllers.js';
import  { protect } from '../middlewares/auth.middleware.js';

// Initialize router
const router = express.Router();

// User registration route
router.post('/register', registerUser);
// User login route
router.post('/login', loginUser);
// User profile route (protected)
router.get('/profile', protect, getUserProfile);

export default router;