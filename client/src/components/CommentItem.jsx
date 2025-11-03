"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { Send } from "lucide-react";

const CommentSection = ({ quoteId, userToken, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);

    // 🧠 Fetch all comments for this quote
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await API.get(`/api/quotes/${quoteId}`);
                const fetchedComments = res.data.quote?.comments || [];
                setComments(fetchedComments.reverse());
            } catch (err) {
                console.error("Error fetching comments:", err.response?.data || err.message);
            }
        };
        fetchComments();
    }, [quoteId]);


    // ✍️ Add new comment
    const handleAddComment = async () => {
        if (!userToken) {
            alert("Please log in to comment.");
            return;
        }
        if (!text.trim()) return;

        setLoading(true);
        const newComment = {
            user: currentUser,
            text,
            createdAt: new Date().toISOString(),
        };

        // Optimistic update
        setComments((prev) => [newComment, ...prev]);
        setText("");

        try {
            await API.post(
                `/api/social/comment/${quoteId}`,
                { text },
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
        } catch (err) {
            console.error("Error adding comment:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full mt-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-lg">
            {/* Add Comment Input */}
            <div className="flex items-center gap-3 mb-4">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-inner"
                    style={{
                        backgroundColor: currentUser?.avatarColor || "#6366F1",
                    }}
                >
                    {currentUser?.name?.charAt(0).toUpperCase() || "?"}
                </div>

                <div className="flex-1 relative">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full bg-white/10 text-white placeholder-gray-400 text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleAddComment}
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Comments List */}
            <div className="max-h-64 overflow-y-auto pr-1 space-y-3">
                <AnimatePresence>
                    {comments.map((comment, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-start gap-3 p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-inner cursor-pointer"
                                style={{
                                    backgroundColor: comment.user?.avatarColor || "#6366F1",
                                }}
                                onClick={() =>
                                    (window.location.href = `/profile/${comment.user?._id}`)
                                }
                            >
                                {comment.user?.name?.charAt(0).toUpperCase() || "?"}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p
                                        onClick={() =>
                                            (window.location.href = `/profile/${comment.user?._id}`)
                                        }
                                        className="text-sm font-semibold text-indigo-300 hover:text-indigo-400 cursor-pointer"
                                    >
                                        {comment.user?.name || "Unknown"}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                        {new Date(comment.createdAt).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-200 mt-1">{comment.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CommentSection;
