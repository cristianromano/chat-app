import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.routes.js";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
