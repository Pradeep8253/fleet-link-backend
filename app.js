import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDB.js";
import vehiclesRouter from "./routes/vehiclesRoutes.js";
import bookingsRouter from "./routes/bookingsRoutes.js";
import authUserRoutes from "./routes/authUsersRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/api/auth", authUserRoutes);
app.use("/api/vehicles", vehiclesRouter);
app.use("/api/bookings", bookingsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
