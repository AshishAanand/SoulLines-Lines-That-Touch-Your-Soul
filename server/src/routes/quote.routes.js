import e from "express";
import { getQuotes, getQuoteById, deleteQuoteById, createQuote } from "../controllers/quote.controllers.js";

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

export default quoteRoutes;
