import e from "express";
import protect from "../middlewares/auth.middleware.js";
import { getQuotes, getQuoteById, createQuote, getUserQuotes, editQuote, deleteQuote } from "../controllers/quote.controllers.js";

const quoteRoutes = e.Router();

// Route to get all quotes
quoteRoutes
    .route("/")
    .get(getQuotes)
    // Route to get a single quote by ID

quoteRoutes
    .route("/:id")
    .get(getQuoteById)

// Get quotes of a specific user
quoteRoutes.get("/:userId/quotes", getUserQuotes);

// Create a new quote
quoteRoutes.post("/", protect, createQuote);

quoteRoutes.patch("/:quoteId", protect, editQuote);
quoteRoutes.delete("/:quoteId", protect, deleteQuote);

export default quoteRoutes;
