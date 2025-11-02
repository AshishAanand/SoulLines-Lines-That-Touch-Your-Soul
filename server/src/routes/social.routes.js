import express from "express";
import { toggleLike, addComment, deleteComment, toggleFollow } from "../controllers/social.controllers.js";
// import  from "../middlewares/auth.middleware.js"; // if you already use it
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// Likes
router.post("/like/:quoteId", protect, toggleLike);

// Comments
router.post("/comment/:quoteId", protect, addComment);
router.delete("/comment/:quoteId/:commentId", protect, deleteComment);

// Follow
router.post("/follow/:targetUserId", protect, toggleFollow);

export default router;
