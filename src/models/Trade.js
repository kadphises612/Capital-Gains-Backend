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
    totalProfit: { type: Number, required: true },
    brokerage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TradeSchema.pre("validate", function (next) {
  if (
    this.buy_price != null &&
    this.sell_price != null &&
    this.quantity != null
  ) {
    this.totalProfit = (this.sell_price - this.buy_price) * this.quantity;
  }
});

TradeSchema.virtual("netProfit").get(function () {
  if (this.totalProfit == null) return null;
  return this.totalProfit - (this.brokerage ?? 0);
});

TradeSchema.set("toJSON", { virtuals: true });
TradeSchema.set("toObject", { virtuals: true });
export const Trade = mongoose.model("Trade", TradeSchema);
