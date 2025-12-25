import Trade from "../models/Trade.js";
import User from "../models/User.js";
import UserSummary from "../models/UserSummary.js";

// Add trade
export const createTrade = async (req, res) => {
  try {
    const {
      userId,
      symbol,
      broker,
      quantity,
      buy_price,
      sell_price,
      tradeDate,
      total_profit,
      tax_and_broker_fee,
      net_profit,
      c_take,
    } = req.body;

    if (
      !userId ||
      !symbol ||
      !broker ||
      !buy_price ||
      !quantity ||
      !sell_price ||
      !total_profit ||
      !tax_and_broker_fee ||
      !net_profit ||
      !tradeDate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }
    const net_profit_ctake = c_take ? net_profit * 0.8 : net_profit;
    const trade = await Trade.create({
      userId,
      symbol,
      broker,
      quantity,
      buy_price,
      sell_price,
      tradeDate,
      total_profit,
      tax_and_broker_fee,
      net_profit,
      net_profit_ctake,
    });
    await UserSummary.findOneAndUpdate(
      { userId },
      {
        $inc: {
          total_trades: 1,
          gross_profit: total_profit,
          total_tax_and_fees: tax_and_broker_fee,
          net_profit: net_profit,
          net_profit_ctake,
        },
      },
      { upsert: true, new: true }
    );

    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trades for a user
export const getTradesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const trades = await Trade.find({ userId }).sort({ tradeDate: 1 });

    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
