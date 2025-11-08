import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import { toast } from "sonner";

const EditQuoteModal = ({ quote, onClose, onUpdate }) => {
  const [text, setText] = useState(quote.text);
  const [tag, setTag] = useState(quote.tag || "");
  const [author, setAuthor] = useState(quote.author || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (!text.trim()) {
      setError("Quote text cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await API.patch(
        `/api/quotes/${quote._id}`,
        { text, author, tag },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        onUpdate(res.data.quote);
        onClose();

        toast.success("Quote updated ✨");

      } else {
        setError("Failed to update quote.");
      }
    } catch (err) {
      console.error("Edit error:", err);
      setError("Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Your Quote
          </h2>

          <div className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-gray-700"
              placeholder="Edit your quote..."
            />

            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">Author</label>
              <input
                type="text"
                className="w-full border border-border rounded-lg p-3 text-sm bg-background focus:ring-2 focus:ring-primary/40 outline-none"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author (optional)"
              />
            </div>

            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700"
              placeholder="Tag (optional)"
            />

            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-150"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`px-5 py-2 rounded-lg font-medium text-white transition-all duration-150 ${loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditQuoteModal;
