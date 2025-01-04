import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.routes.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "public")));

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // If cookies or authentication are needed
  })
);
app.options("*", cors()); // This handles the pre-flight request

app.use(
  express.json({
    limit: "30mb",
    extended: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "/dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
