import e from "express";
import protect from "../middlewares/auth.middleware.js";
import { getQuotes, getQuoteById, deleteQuoteById, createQuote, getUserQuotes } from "../controllers/quote.controllers.js";

const quoteRoutes = e.Router();

// Route to get all quotes
quoteRoutes
    .route("/")
    .get(getQuotes)
    // Route to get a single quote by ID

quoteRoutes
    .route("/:id")
    .get(getQuoteById)
    .delete(deleteQuoteById);

// Get quotes of a specific user
quoteRoutes.get("/:userId/quotes", getUserQuotes);

// Create a new quote
quoteRoutes.post("/", protect, createQuote);

export default quoteRoutes;
