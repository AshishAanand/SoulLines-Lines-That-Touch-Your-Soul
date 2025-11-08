import React, { useEffect, useState } from 'react';
import QuoteCard from '../components/QuoteCard.jsx';
import API from '../services/api.js';
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const Quotes = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const userToken = localStorage.getItem("token");


  useEffect(() => {

    // Fetch quotes from the API
    const fetchQuotes = async () => {
      try {
        const response = await API.get("api/quotes");

        setQuotes(response.data.quotes || []);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

// ✅ Update a quote locally after edit (preserves user info)
const handleUpdateQuote = (updatedQuote) => {
  setQuotes((prev) =>
    prev.map((q) =>
      q._id === updatedQuote._id
        ? { ...q, ...updatedQuote, user: q.user } // keep old user info
        : q
    )
  );
};

  // ✅ Delete a quote locally after deletion
  const handleDeleteQuote = (deletedQuoteId) => {
    setQuotes((prev) => prev.filter((q) => q._id !== deletedQuoteId));
  };

  if (loading){
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading quotes...
      </div>
    );
  }


  if (quotes.length === 0) {
    return <div className="text-center py-16 text-lg text-gray-600">No quotes yet. Be the first to add one!</div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">Words That Breathe</h1>
          <p className="text-muted-foreground text-lg">Discover quotes that resonate with your soul</p>
        </div>

        {/* Quotes List */}
        <div className="space-y-6">
          {quotes.map((quote) => (
            // <QuoteCard key={quote._id} quote={quote} userToken={userToken} />
            <QuoteCard
              key={quote._id}
              quote={quote}
              onUpdateQuote={handleUpdateQuote}
              onDeleteQuote={handleDeleteQuote}
              userToken={userToken}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Quotes;
