import mongoose from "mongoose";

const TradeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    broker: {
      type: String,
      enum: ["zerodha", "groww", "upstox", "angleone"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    buy_price: {
      type: Number,
      required: true,
      min: 0,
    },
    sell_price: {
      type: Number,
      required: true,
      min: 0,
    },
    tradeDate: {
      type: Date,
      required: true,
    },
    tradeProfit: { type: Number, required: true, default: 0 },
    profitAfterBrokerage: { type: Number, required: true, default: 0 },
    commissionPaid: { type: Number, required: true, default: 0 },
    profitAfterCommission: { type: Number, required: true, default: 0 },
    brokerage: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

export const Trade = mongoose.model("Trade", TradeSchema);
