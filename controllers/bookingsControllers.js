import Booking from "../models/Booking.js";
import Vehicle from "../models/Vehicle.js";
import { estimateRideDurationHours } from "../utils/estimateDuration.js";

export const getBookings = async (req, res) => {
  try {
    const { customerId } = req.query;
    const filter = customerId ? { customerId } : {};
    const bookings = await Booking.find(filter)
      .populate("vehicleId", "name capacityKg tyres")
      .sort({ startTime: -1 })
      .lean();
    res.json(bookings);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { vehicleId, fromPinCode, toPinCode, startTime } = req.body;

    const customerId = req.user?._id;

    if (!vehicleId || !fromPinCode || !toPinCode || !startTime || !customerId) {
      return res.status(400).json({
        message:
          "vehicleId, fromPinCode, toPinCode, startTime are required and you must be logged in",
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid startTime" });
    }

    const hours = estimateRideDurationHours(fromPinCode, toPinCode);
    const end = new Date(start.getTime() + hours * 3600 * 1000);

    const conflict = await Booking.exists({
      vehicleId,
      $expr: {
        $and: [{ $lt: ["$startTime", end] }, { $lt: [start, "$endTime"] }],
      },
    });
    if (conflict) {
      return res
        .status(409)
        .json({ message: "Vehicle became unavailable for the selected slot" });
    }

    const booking = await Booking.create({
      vehicleId,
      fromPinCode,
      toPinCode,
      startTime: start,
      endTime: end,
      customerId,
    });

    res.status(201).json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found" });
    res.json({ ok: true, deletedId: deleted._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to delete booking" });
  }
};
