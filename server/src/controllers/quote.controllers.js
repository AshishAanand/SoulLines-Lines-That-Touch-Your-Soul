import Quote from "../models/Quote.model.js";

// @desc    Get all quotes
// @route   GET /api/quotes

const getQuotes = async (req, res) => {
    try {

        const quotes = await Quote.find().sort({ createdAt: -1 }); // Sort by newest first

        if (quotes.length === 0) {
            return res.status(404).json({ message: "No quotes found" });
        }
        res.status(200).json(quotes);

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Create a new quote
// @route   POST /api/quotes

const createQuote = async (req, res) => {

    try {

        const { text, author } = req.body;

        if (!text || !author) {
            return res.status(400).json({ message: "Quote and Author are required", status: 400 });
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
        
        const newQuote = new Quote({ text, author });
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
        res.status(200).json({message: "Quote retrieved successfully", quote: quote, status: 200});
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
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

export { getQuotes, createQuote, getQuoteById, deleteQuoteById };