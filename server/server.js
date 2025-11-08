import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from 'cors';
import cookieParser from "cookie-parser";
import {connectDB} from "./src/configs/db.configs.js";


// ############################### ( Importing Routes ) ##############################
import quoteRoutes from "./src/routes/quote.routes.js";
import userRoutes from './src/routes/user.routes.js';
import socialRoutes from './src/routes/social.routes.js';


dotenv.config();

// Initialize Express app
const app = express();

// Connection to Database

connectDB().then(() => {
    console.log("Database connection established");
}).catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});


// ############################## ( Middlewares ) ##############################

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(
    { origin: '*' }
));
app.use(cookieParser());


// ############################## ( Routes ) ###################################

app.use("/api/quotes", quoteRoutes); // for quote-related routes
app.use("/api/users", userRoutes);   // for user-related routes
app.use("/api/social", socialRoutes); // for social interactions like likes, comments, follows

// ############################## ( Error Handling ) ###########################

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});



// ############################ (Server setup) ##############################

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});