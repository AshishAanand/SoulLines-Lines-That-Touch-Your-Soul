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
            likesCount: quote.likes.length, success: true
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

        res.status(201).json({ message: "Comment added", comments: quote.comments, success: true });
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

        res.status(200).json({ message: "Comment deleted", success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc   Follow / Unfollow a user
// @route  POST /api/social/follow/:username

/**
 * POST /api/social/follow/:username
 * Toggle follow/unfollow the user with given username
 */

const toggleFollowByUsername = async (req, res) => {
  try {
    const followerId = req.user && req.user._id; // from protect middleware
    const { username } = req.params;

    if (!followerId)
      return res.status(401).json({ success: false, message: "Not authorized" });

    // find target (followee) by username
    const targetUser = await User.findOne({ username }).exec();
    if (!targetUser)
      return res.status(404).json({ success: false, message: "User not found" });

    // cannot follow yourself
    if (targetUser._id.equals(followerId))
      return res
        .status(400)
        .json({ success: false, message: "You cannot follow yourself" });

    const follower = await User.findById(followerId).exec();
    if (!follower)
      return res
        .status(404)
        .json({ success: false, message: "Your user not found" });

    const alreadyFollowing = follower.following.some((id) =>
      id.equals(targetUser._id)
    );

    if (alreadyFollowing) {
      // --- Unfollow ---
      await User.updateOne(
        { _id: followerId },
        { $pull: { following: targetUser._id } }
      ).exec();
      await User.updateOne(
        { _id: targetUser._id },
        { $pull: { followers: followerId } }
      ).exec();

      // fetch updated target counts
      const updatedTarget = await User.findById(targetUser._id)
        .select("followers following")
        .exec();

      const followersCount = (updatedTarget.followers || []).length;
      const followingCount = (updatedTarget.following || []).length;

      return res.json({
        success: true,
        message: "Unfollowed user",
        followersCount,
        followingCount,
        isFollowing: false,
      });
    } else {
      // --- Follow ---
      await User.updateOne(
        { _id: followerId, following: { $ne: targetUser._id } },
        { $push: { following: targetUser._id } }
      ).exec();
      await User.updateOne(
        { _id: targetUser._id, followers: { $ne: followerId } },
        { $push: { followers: followerId } }
      ).exec();

      // fetch updated target counts
      const updatedTarget = await User.findById(targetUser._id)
        .select("followers following")
        .exec();

      const followersCount = (updatedTarget.followers || []).length;
      const followingCount = (updatedTarget.following || []).length;

      return res.json({
        success: true,
        message: "Followed user",
        followersCount,
        followingCount,
        isFollowing: true,
      });
    }
  } catch (err) {
    console.error("toggleFollowByUsername error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * GET /api/social/follow/:username/status
 * Optional: get counts and whether logged-in user follows :username
 */
const getFollowStatusByUsername = async (req, res) => {
  try {
    const currentUserId = req.user && req.user._id;
    const { username } = req.params;

    const target = await User.findOne({ username })
      .select("followers following name username _id")
      .exec();

    if (!target)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const followersCount = (target.followers || []).length;
    const followingCount = (target.following || []).length;
    const isFollowing = currentUserId
      ? (target.followers || []).some((id) => id.equals(currentUserId))
      : false;

    return res.json({
      success: true,
      user: {
        _id: target._id,
        name: target.name,
        username: target.username,
      },
      followersCount,
      followingCount,
      isFollowing,
    });
  } catch (err) {
    console.error("getFollowStatusByUsername error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export { toggleLike, addComment, deleteComment, toggleFollowByUsername, getFollowStatusByUsername };
