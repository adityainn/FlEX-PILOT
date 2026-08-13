import dotenv from "dotenv";
dotenv.config();
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING");
console.log("Value:", process.env.GEMINI_API_KEY);
