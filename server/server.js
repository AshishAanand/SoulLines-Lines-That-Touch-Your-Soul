import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from 'cors';
import {connectDB} from "./src/configs/db.configs.js";

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



// ############################## ( Routes ) ###################################

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

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