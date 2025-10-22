import e from "express";
import protect from "../middleware/auth.middleware.js";
import { getQuotes, getQuoteById, deleteQuoteById, createQuote, likeQuote, commentOnQuote } from "../controllers/quote.controllers.js";

const quoteRoutes = e.Router();

// Route to get all quotes
quoteRoutes
    .route("/")
    .get(getQuotes)
    // Route to get a single quote by ID
    .post(createQuote);

quoteRoutes
    .route("/:id")
    .get(getQuoteById)
    .delete(deleteQuoteById);

// Like a quote
quoteRoutes.put("/:id/like", protect, likeQuote);

// Comment on a quote
quoteRoutes.post("/:id/comment", protect, commentOnQuote);

export default quoteRoutes;
