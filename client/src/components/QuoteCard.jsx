"use client";

import { Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

const QuoteCard = ({ quote, isLiked, onLike }) => {
  const likeCount = (quote.likes || 0) + (isLiked ? 1 : 0);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="relative group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-[0_8px_40px_rgba(79,70,229,0.15)] hover:shadow-[0_10px_50px_rgba(79,70,229,0.25)] transition-all duration-300 overflow-hidden"
    >
      {/* Soft gradient glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-teal-400/10 blur-3xl pointer-events-none"></div>

      {/* Header — User info */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-inner"
          style={{
            backgroundColor: quote.user?.avatarColor || "#6366F1",
          }}
        >
          {quote.user?.name ? quote.user.name.charAt(0).toUpperCase() : "?"}
        </div>

        <div>
          <h3 className="font-semibold text-foreground">
            {quote.user?.name || "Unknown User"}
          </h3>
          <p className="text-xs text-muted-foreground">
            @{quote.user?.username || "anonymous"}
          </p>
        </div>
      </div>

      {/* Tag */}
      {quote.tag && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-teal-400/20 text-indigo-400 text-xs font-semibold rounded-full backdrop-blur-md border border-white/10">
            #{quote.tag.toLowerCase()}
          </span>
        </div>
      )}

      {/* Quote Text */}
      <blockquote className="relative mb-6">
        <p className="font-serif text-2xl sm:text-3xl text-black leading-relaxed italic">
          “{quote.text}”
        </p>
        <footer className="mt-3 text-sm text-indigo-500 font-medium">
          — {quote.author || "Anonymous"}
        </footer>
      </blockquote>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <div className="flex items-center gap-6">
          <button
            onClick={onLike}
            className="flex items-center gap-2 text-indigo-200 hover:text-indigo-400 transition-colors"
          >
            <Heart
              className={`w-5 h-5 transition-all ${
                isLiked
                  ? "fill-indigo-500 text-indigo-500 scale-110"
                  : "text-indigo-300"
              }`}
            />
            <span className="text-sm text-blue-500 font-medium">{likeCount}</span>
          </button>

          <button className="flex items-center gap-2 text-indigo-400 hover:text-teal-500 transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 italic">
          {new Date(quote.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
    </motion.div>
  );
};

export default QuoteCard;
