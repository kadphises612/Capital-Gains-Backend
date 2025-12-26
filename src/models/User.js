import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pan: { type: String, required: true, unique: true, uppercase: true },
    commissionRate: { type: Number, default: 0 },
    commissionPerTrade: { type: Boolean, default: false },
    taxRate: { type: Number, default: 0 },
    taxOnTotalProfit: { type: Boolean, default: false },
    broker: {
      type: String,
      enum: ["zerodha", "groww", "upstox", "angleone"],
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
