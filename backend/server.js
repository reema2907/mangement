import express from "express";
import mongoose from "mongoose";
import { adminRouter } from "./routes/adminRoutes.js";

import dotenv from "dotenv";

import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use("/api", adminRouter);
app.use(express.static('Public'))


mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
