"use client"

import { useState } from "react"
import QuoteCard from '../components/QuoteCard.jsx'
// Sample quote data
const QUOTES = [
  {
    id: 1,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "Inspiration",
    likes: 234,
  },
  {
    id: 2,
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Resilience",
    likes: 189,
  },
  {
    id: 3,
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "Growth",
    likes: 156,
  },
  {
    id: 4,
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
    category: "Dreams",
    likes: 201,
  },
  {
    id: 5,
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "Motivation",
    likes: 178,
  },
  {
    id: 6,
    text: "Happiness is not something ready made. It comes from your own actions.",
    author: "Dalai Lama",
    category: "Happiness",
    likes: 267,
  },
]

const Quotes = () => {
  const [likedQuotes, setLikedQuotes] = useState([])

  const toggleLike = (id) => {
    setLikedQuotes((prev) => (prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]))
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">Quote Feed</h1>
            <p className="text-muted-foreground text-lg">Discover quotes that resonate with your soul</p>
          </div>

          {/* Quotes Grid */}
          <div className="space-y-6">
            {QUOTES.map((quote) => (
              <QuoteCard
                key={quote.id}
                quote={quote}
                isLiked={likedQuotes.includes(quote.id)}
                onLike={() => toggleLike(quote.id)}
              />
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <button className="px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors">
              Load More Quotes
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default Quotes;
