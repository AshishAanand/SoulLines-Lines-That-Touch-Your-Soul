import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import TokenBlacklist from '../models/tokenBlackList.model.js';

const protect = async (req, res, next) => {

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {

            token = req.headers.authorization.split(' ')[1];

            // Check if token is blacklisted
            const blacklisted = await TokenBlacklist.findOne({ token });
            if (blacklisted) {
                return res.status(401).json({ message: "Token has been revoked", status: 401 });
            }

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Get user from the token

            req.user = await User.findById(decoded.id).select('-password');

            next();

        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed', status: 401 });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token', status: 401 });
    }

};

export default protect;