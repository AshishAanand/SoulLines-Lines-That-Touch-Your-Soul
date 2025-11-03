import React, { useEffect, useState } from 'react';
import QuoteCard from '../components/QuoteCard.jsx';
import API from '../services/api.js';

const Quotes = () => {
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

  if (loading) {
    return <div className="text-center py-16 text-lg text-gray-600">Loading quotes...</div>;
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
            <QuoteCard key={quote._id} quote={quote} userToken={userToken} />
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
  );
};

export default Quotes;
