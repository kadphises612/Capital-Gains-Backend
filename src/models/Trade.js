import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    totalProfit: { type: Number, required: true },
    brokerage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Trade = mongoose.model("Trade", TradeSchema);
