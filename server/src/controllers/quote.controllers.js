import Quote from "../models/Quote.model.js";

// @desc    Get all quotes
// @route   GET /api/quotes

const getQuotes = async (req, res) => {
    try {

        const quotes = await Quote.find().sort({ createdAt: -1 }); // Sort by newest first

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

        const { text, author, tags } = req.body;
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
            tags,
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
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: "Quote not found" });
        }
        res.status(200).json({ message: "Quote retrieved successfully", quote: quote, status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
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
            // It's a common practice to return a 200 OK with an empty array
            // rather than a 404 Not Found, as the request was valid, but no
            // resources were found for that user. Either is acceptable depending on
            // your API's design philosophy.
            return res.status(200).json({ success: true, quotes: [] });
        }

        res.status(200).json({ success: true, quotes });
    } catch (error) {
        console.error(error); // Log the full error for debugging
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// @desc Delete a quote by ID
// @route DELETE /api/quotes/:id

const deleteQuoteById = async (req, res) => {
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: "Quote not found", status: 404 });
        }
        res.status(200).json({ message: "Quote deleted successfully", status: 200 });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message, status: 500 });
    }
};

// @desc Like a quote by ID
// @route POST /api/quotes/:id/like

const likeQuote = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: "Quote not found" });
        }
        quote.likes += 1;
        await quote.save();
        res.status(200).json({ message: "Quote liked successfully", quote: quote });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc Comment on a quote by ID
// @route POST /api/quotes/:id/comment

const commentOnQuote = async (req, res) => {
    try {
        const { comment } = req.body;
        if (!comment) {
            return res.status(400).json({ message: "Comment is required" });
        }
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: "Quote not found" });
        }
        quote.comments.push(comment);
        await quote.save();
        res.status(200).json({ message: "Comment added successfully", quote: quote });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


export { getQuotes, createQuote, getQuoteById, deleteQuoteById, likeQuote, commentOnQuote, getUserQuotes };