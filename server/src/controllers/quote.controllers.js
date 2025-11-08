import Quote from "../models/Quote.model.js";
import sanitizeHtml from "sanitize-html";

// @desc    Get all quotes
// @route   GET /api/quotes

const getQuotes = async (req, res) => {
    try {

        const quotes = await Quote.find()
            .populate("user", "name username")
            .populate("comments.user", "name username")
            .sort({ createdAt: -1 });

        if (quotes.length === 0) {
            return res.status(404).json({ message: "No quotes found" });
        }
        res.status(200).json({ success: true, quotes });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Create a new quote
// @route   POST /api/quotes

const createQuote = async (req, res) => {

    try {

        const { text, author, tag } = req.body;
        const userId = req.user._id; // Make sure this comes from auth middleware


        if (!text || !author) {
            return res.status(400).json({ message: "Quote and Author are required", status: 400 });
        }

        // Ensure auth middleware provided user
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: No user found" });
        }

        // Check for duplicate quote
        const existingQuote = await Quote.findOne({ text: text.trim() });
        if (existingQuote) {
            return res.status(409).json({ message: "Quote already exists", status: 409 });
        }

        // Check for database connection
        if (Quote.db.readyState !== 1) { // 1 means connected
            return res.status(503).json({ message: "Database is not connected", status: 503 });
        }

        const newQuote = await Quote.create({
            text,
            author,
            tag,
            user: userId, // link the quote to logged-in user
        });

        await newQuote.save();

        res.status(201).json({ message: "Quote created successfully", quote: newQuote, status: 201 });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, status: 500 });
    }

};

// @desc Get single quote by ID
// @route GET /api/quotes/:id

const getQuoteById = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id).populate("user").populate("comments.user");
        if (!quote) return res.status(404).json({ success: false, message: "Quote not found" });
        res.json({ success: true, quote });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const getUserQuotes = async (req, res) => {
    // Correctly destructure userId from the req.params object
    const { userId } = req.params;

    // Best practice: Validate the userId immediately
    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        const quotes = await Quote.find({ user: userId }).sort({ createdAt: -1 });

        // Mongoose's `find()` returns an empty array if no documents are found,
        // so checking `quotes.length === 0` is the correct way to handle this.
        if (quotes.length === 0) {
            return res.status(200).json({ success: true, quotes: [] });
        }

        res.status(200).json({ success: true, quotes });
    } catch (error) {
        console.error(error); // Log the full error for debugging
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// @desc Edit quote by ID
// @route PATCH /api/quotes/:quoteId

const editQuote = async (req, res) => {
    try {

        const { quoteId } = req.params;
        const userId = req.user && (req.user._id || req.user.id); // from protect
        const { text, author, tag } = req.body;

        // edge cases and security checks

        if (!text || typeof text !== "string") {
            return res.status(400).json({ success: false, message: "Invalid quote text" });
        }

        // fetching quote from DB
        const quote = await Quote.findById(quoteId);
        if (!quote) {
            return res.status(404).json({ message: "Quote not found", status: 404 });
        }

        // Check if the logged-in user is the owner of the quote
        if (quote.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Forbidden: You are not the owner of this quote", status: 403 });
        }

        if (!quote.user.equals(userId)) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        // sanitize inputs to avoid XSS
        quote.text = sanitizeHtml(text.trim());
        if (author !== undefined) quote.author = sanitizeHtml(String(author).trim() || "Anonymous");
        if (tag !== undefined) quote.tag = String(tag).trim().toLowerCase() || null;

        await quote.save();
        res.json({ success: true, message: "Quote updated", quote });
    } catch (err) {
        console.error("editQuote error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};


// @desc Delete a quote by ID
// @route DELETE /api/quotes/:id

const deleteQuote = async (req, res) => {
    try {
        const { quoteId } = req.params;
        const userId = req.user && (req.user._id || req.user.id);

        const quote = await Quote.findById(quoteId);
        if (!quote) return res.status(404).json({ success: false, message: "Quote not found" });

        if (!quote.user.equals(userId))
            return res.status(403).json({ success: false, message: "Not authorized" });

        await quote.deleteOne(); // permanent delete. Use soft-delete if preferred.
        res.json({ success: true, message: "Quote deleted", quoteId });
    } catch (err) {
        console.error("deleteQuote error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};


export { getQuotes, createQuote, getQuoteById, deleteQuote, getUserQuotes, editQuote };