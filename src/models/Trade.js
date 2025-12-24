import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema(
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
      enum: ["zerodha", "groww", "upstox", "angle_one"],
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
    total_profit: {
      type: Number,
      required: true,
    },
    tax_and_broker_fee: {
      type: Number,
      required: true,
    },
    net_profit: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Trade = mongoose.model("Trade", tradeSchema);
export default Trade;
