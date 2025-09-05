import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    fromPinCode: { type: String, required: true },
    toPinCode: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    deleted: {
      type: Boolean,
      default: false,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

BookingSchema.index({ vehicleId: 1, startTime: 1, endTime: 1 });

export default mongoose.model("Booking", BookingSchema);
