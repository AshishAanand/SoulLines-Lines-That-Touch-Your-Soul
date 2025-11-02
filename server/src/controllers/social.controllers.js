import User from '../models/User.model.js';
import Quote from '../models/Quote.model.js';

// @desc   Like / Unlike a quote
// @route  POST /api/social/like/:postId

const toggleLike = async (req, res) => {
    try {
        const { quoteId } = req.params;
        const userId = req.user.id; // from auth middleware

        const quote = await Quote.findById(quoteId);

        console.log("Quote found:", quote);
        if (!quote) return res.status(404).json({ message: "Quote not found" });

        const alreadyLiked = quote.likes.includes(userId);

        if (alreadyLiked) {
            quote.likes.pull(userId);
        } else {
            quote.likes.push(userId);
        }

        await quote.save();
        res.status(200).json({
            message: alreadyLiked ? "Quote unliked" : "Quote liked",
            likesCount: quote.likes.length,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc   Add a comment to a quote
// @route  POST /api/social/comment/:postId

const addComment = async (req, res) => {
    try {
        const { quoteId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        const quote = await Quote.findById(quoteId);
        if (!quote) return res.status(404).json({ message: "Post not found" });

        quote.comments.push({ user: userId, text });
        await quote.save();

        res.status(201).json({ message: "Comment added", comments: quote.comments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc   Delete a comment from a quote
// @route  DELETE /api/social/comment/:postId/:commentId

const deleteComment = async (req, res) => {
    try {
        const { quoteId, commentId } = req.params;
        const userId = req.user._id;

        const quote = await Quote.findById(quoteId);
        if (!quote) return res.status(404).json({ message: "Post not found" });

        const comment = quote.comments.id(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (comment.user.toString() !== userId)
            return res.status(403).json({ message: "Not authorized" });

        comment.deleteOne();
        await quote.save();

        res.status(200).json({ message: "Comment deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc   Follow / Unfollow a user
// @route  POST /api/social/follow/:targetUserId

const toggleFollow = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user._id;

        if (userId === targetUserId)
            return res.status(400).json({ message: "You cannot follow yourself" });

        const user = await User.findById(userId);
        const targetUser = await User.findById(targetUserId);

        if (!targetUser) return res.status(404).json({ message: "User not found" });

        const alreadyFollowing = user.following.includes(targetUserId);

        if (alreadyFollowing) {
            user.following.pull(targetUserId);
            targetUser.followers.pull(userId);
        } else {
            user.following.push(targetUserId);
            targetUser.followers.push(userId);
        }

        await user.save();
        await targetUser.save();

        res.status(200).json({
            message: alreadyFollowing ? "Unfollowed user" : "Followed user",
            followersCount: targetUser.followers.length,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { toggleLike, addComment, deleteComment, toggleFollow };
