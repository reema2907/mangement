import express from "express";
import mongoose from "mongoose";
import { adminRouter } from "./routes/adminRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// CORS setup for frontend running on port 3000
app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // to handle cookies or authentication
}));

// Middleware
app.use(express.json());  // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(express.static('Public')); // Serves static files like images, CSS

// Routes
app.use("/api", adminRouter);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));


// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});
