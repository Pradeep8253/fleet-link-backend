import { Router } from "express";
import {
  addVehicles,
  getAvailableVehicles,
} from "../controllers/vehiclesControllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, addVehicles);

router.get("/available", getAvailableVehicles);

export default router;
