"use client";

import { Heart, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "sonner";

import EditQuoteModal from "./EditQuoteModal.jsx";
import DeleteConfirmModal from "./DeleteConfirmModal.jsx";
import API from "../services/api";

const QuoteCard = ({ quote, userToken, onUpdateQuote, onDeleteQuote }) => {
  const [likeCount, setLikeCount] = useState(quote.likes?.length || 0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const { user: currentUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);


  const isOwner = currentUser?.username === quote?.user?.username;

  // Handle Like
  const handleLike = async () => {
    if (!userToken) {
      toast.error("Please log in to like posts.");
      return;
    }

    try {
      const res = await API.post(
        `/api/social/like/${quote._id}`,
        {},
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setLikeCount(res.data.likesCount);
      setLiked((prev) => !prev);

      toast.success(liked ? "Unliked 💔" : "Liked ❤️");

    } catch (err) {
      toast.error("Failed to toggle like. Try again.");
      console.error(err);
    }
  };

  // Fetch Comments
  const fetchComments = async () => {
    try {
      setCommentLoading(true);
      const res = await API.get(`/api/quotes/${quote._id}`);
      const fetchedComments = res.data.quote?.comments || [];
      setComments(fetchedComments.reverse());
    } catch (err) {
      console.error("Error fetching comments:", err.response?.data || err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  // Post Comment
  const handlePostComment = async () => {
    if (!userToken) {
      alert("Please log in to comment.");
      return;
    }

    if (!commentText.trim()) return;

    setLoading(true);
    try {
      await API.post(
        `/api/social/comment/${quote._id}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      // Refresh comments after posting
      await fetchComments();
      setCommentText("");

      toast.success("Comment added 📝");

    } catch (err) {
      toast.error("Failed to post comment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quote.likes?.includes(currentUser?._id)) {
      setLiked(true);
    }

    fetchComments();
  }, [quote.likes, currentUser]);


  // Open Comment Drawer
  const openComments = () => {
    setShowComments(true);
  };

  // useEffect(() => {
  //   if (showComments) {
  //     const container = document.querySelector(".comments-container");
  //     if (container) container.scrollTop = container.scrollHeight;
  //   }
  // }, [showComments, comments]);

  const getUserInitials = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  // ✅ Navigate to profile using username
  const navigate = useNavigate();

  const goToProfile = (username) => {
    if (!username) return;
    if (username === currentUser?.username) navigate("/profile");
    else navigate(`/profile/${username}`);
  };

  const timeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    if (isNaN(past)) return "";

    const diffInSeconds = Math.floor((now - past) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}y ago`;
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <div className="relative bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 shadow-sm">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        <div className="relative p-5 sm:p-6 lg:p-8 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 min-w-0 cursor-pointer"
              onClick={() => goToProfile(quote.user?.username)} // ✅ updated
            >
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md flex-shrink-0 transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: quote.user?.avatarColor || "#6366F1",
                }}
              >
                {getUserInitials(quote.user?.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-foreground text-sm sm:text-base truncate hover:text-primary transition-colors">
                  {quote.user?.name || "Unknown"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  @{quote.user?.username || "anonymous"}
                </p>
              </div>
            </div>

            <time className="text-xs text-muted-foreground font-medium whitespace-nowrap ml-2">
              {timeAgo(quote.createdAt)}
            </time>

            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical size={18} />
                </button>

                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 w-28"
                    >
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowEdit(true);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setShowDelete(true);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
                      >
                        Delete
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </div>

          {/* Tag */}
          {quote.tag && (
            <div>
              <span className="inline-block px-3 py-1.5 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-semibold rounded-full border border-primary/20 transition-colors">
                #{quote.tag.toLowerCase()}
              </span>
            </div>
          )}

          {/* Quote */}
          <blockquote className="relative space-y-3">
            <p className="font-serif text-2xl sm:text-3xl lg:text-4xl text-foreground leading-relaxed text-balance">
              “{quote.text}”
            </p>
            <footer
              className="text-sm sm:text-base text-primary font-medium cursor-pointer hover:underline"
              onClick={() => goToProfile(quote.user?.username)} // ✅ updated
            >
              — {quote.author || "Anonymous"}
            </footer>
          </blockquote>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t border-border">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Like */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className="group/btn flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors py-2 px-2 -mx-2 rounded-lg"
              >
                <Heart
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${liked
                    ? "fill-primary text-primary scale-110"
                    : "group-hover/btn:text-primary/80"
                    }`}
                />
                <span className="text-sm font-semibold">{likeCount}</span>
              </motion.button>

              {/* Comment */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={openComments}
                className="group/btn flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors py-2 px-2 -mx-2 rounded-lg"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover/btn:text-accent/80 transition-colors" />
                <span className="text-sm font-semibold">{comments.length}</span>
              </motion.button>
            </div>
          </div>
          {/* Modals */}
          {showEdit && (
            <EditQuoteModal
              quote={quote}
              onClose={() => setShowEdit(false)}
              onUpdate={onUpdateQuote}
            />
          )}

          {showDelete && (
            <DeleteConfirmModal
              quoteId={quote._id}
              onClose={() => setShowDelete(false)}
              onDelete={onDeleteQuote}
            />
          )}
        </div>
      </div>

      {/* 🧩 Comment Drawer */}
      <AnimatePresence>
        {showComments && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComments(false)}
            />

            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-h-[75vh] flex flex-col shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border sticky top-0 bg-card rounded-t-3xl">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Comments ({comments.length})
                </h2>
                <button
                  onClick={() => setShowComments(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="p-4 sm:p-6 border-b border-border space-y-3 sticky top-[68px] bg-card">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="flex-1 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                    disabled={!userToken}
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePostComment}
                    disabled={loading || !userToken || !commentText.trim()}
                    className="px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm"
                  >
                    {loading ? "..." : "Send"}
                  </motion.button>
                </div>
                {!userToken && (
                  <p className="text-xs text-muted-foreground">
                    Please log in to comment
                  </p>
                )}
              </div>

              <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 comments-container">
                {commentLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm animate-pulse">
                      Loading comments...
                    </p>
                  </div>
                ) : comments.length > 0 ? (
                  comments
                    .filter((c) => c && typeof c === "object")
                    .map((c) => {
                      const user = c.user || {};
                      return (
                        <motion.div
                          key={c._id || Math.random()}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="group p-4 rounded-2xl border border-border/40 bg-background/70 hover:bg-background/90 transition-all duration-200"
                        >
                          <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => user.username && goToProfile(user.username)} // ✅ updated
                          >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                            </div>
                            <p className="text-sm font-semibold text-indigo-300 group-hover:text-indigo-400 transition-colors">
                              {user.name || "Unknown"}
                            </p>
                          </div>

                          <p className="mt-3 text-foreground/90 text-sm leading-relaxed border-l-2 border-indigo-600/40 pl-3">
                            {c.text || ""}
                          </p>
                        </motion.div>
                      );
                    })
                ) : (
                  <div className="text-center py-10">
                    <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-25" />
                    <p className="text-muted-foreground text-sm">
                      No comments yet. Be the first!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default QuoteCard;
