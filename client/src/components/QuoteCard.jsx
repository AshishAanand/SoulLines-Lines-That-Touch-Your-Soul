"use client"

import { Heart, Share2 } from "lucide-react"

const QuoteCard = ({ quote, isLiked, onLike }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
          {quote.category}
        </span>
      </div>

      {/* Quote Text */}
      <blockquote className="mb-6">
        <p className="font-serif text-2xl sm:text-3xl text-foreground leading-relaxed mb-4">"{quote.text}"</p>
        <footer className="text-muted-foreground font-medium">— {quote.author}</footer>
      </blockquote>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div className="flex items-center gap-4">
          <button
            onClick={onLike}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-primary text-primary" : ""}`} />
            <span className="text-sm font-medium">{quote.likes + (isLiked ? 1 : 0)}</span>
          </button>
          <button className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuoteCard;
