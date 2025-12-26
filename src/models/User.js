import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    commissionRate: { type: Number, default: 0 },
    commissionPerTrade: { type: Boolean, default: false },

    taxRate: { type: Number, default: 0 },
    taxOnTotalProfit: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
