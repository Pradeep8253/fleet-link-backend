import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import { estimateRideDurationHours } from "../utils/estimateDuration.js";

export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPinCode, toPinCode, startTime } = req.query;

    if (!capacityRequired || !fromPinCode || !toPinCode || !startTime) {
      return res.status(400).json({
        message:
          "capacityRequired, fromPinCode, toPinCode, startTime are required",
      });
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime()))
      return res.status(400).json({ message: "Invalid startTime" });

    const hours = estimateRideDurationHours(fromPinCode, toPinCode);
    const end = new Date(start.getTime() + hours * 3600 * 1000);

    const candidates = await Vehicle.find({
      capacityKg: { $gte: Number(capacityRequired) },
    }).lean();

    const vehicleIds = candidates.map((v) => v._id);
    const overlapping = await Booking.find({
      vehicleId: { $in: vehicleIds },
      $expr: {
        $and: [{ $lt: ["$startTime", end] }, { $lt: [start, "$endTime"] }],
      },
    }).lean();

    const busyIds = new Set(overlapping.map((b) => String(b.vehicleId)));
    const available = candidates.filter((v) => !busyIds.has(String(v._id)));

    res.json({
      estimatedRideDurationHours: hours,
      items: available,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to get availability" });
  }
};
export const addVehicles = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || capacityKg == null || tyres == null) {
      return res
        .status(400)
        .json({ message: "name, capacityKg, tyres are required" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const v = await Vehicle.create({
      name,
      capacityKg,
      tyres,
      customerId: req.user._id,
    });

    res.status(201).json(v);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create vehicle" });
  }
};
