import express from "express";
import { toggleLike, addComment, deleteComment, toggleFollowByUsername, getFollowStatusByUsername, editComment } from "../controllers/social.controllers.js";
// import  from "../middlewares/auth.middleware.js"; // if you already use it
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// Likes
router.post("/like/:quoteId", protect, toggleLike);

// Comments
router.post("/comment/:quoteId", protect, addComment);
router.delete("/comment/:quoteId/:commentId", protect, deleteComment);

// Toggle follow/unfollow by username
router.post("/follow/:username", protect, toggleFollowByUsername);
// Optional: get follow status and counts for profile page
router.get("/follow/:username/status", protect, getFollowStatusByUsername);

router.patch("/comment/:quoteId/:commentId", protect, editComment); // route for editing comment

export default router;
