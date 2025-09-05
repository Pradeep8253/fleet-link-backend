import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    capacityKg: { type: Number, required: true, min: 0 },
    tyres: { type: Number, required: true, min: 2 },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", VehicleSchema);
