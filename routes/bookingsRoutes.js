import { Router } from "express";
import {
  createBooking,
  deleteBooking,
  getBookings,
} from "../controllers/bookingsControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getBookings);

router.post("/", authMiddleware, createBooking);

router.delete("/:id", authMiddleware, deleteBooking);

export default router;
