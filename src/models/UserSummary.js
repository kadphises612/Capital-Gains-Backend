import mongoose from "mongoose";

const userSummarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    total_trades: {
      type: Number,
      default: 0,
    },
    gross_profit: {
      type: Number,
      default: 0,
    },
    total_tax_and_fees: {
      type: Number,
      default: 0,
    },
    net_profit: {
      type: Number,
      default: 0,
    },
    net_profit_ctake: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserSummary", userSummarySchema);
