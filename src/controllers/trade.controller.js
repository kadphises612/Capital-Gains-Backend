import Trade from "../models/Trade.js";
import User from "../models/User.js";

// Add trade
export const createTrade = async (req, res) => {
  try {
    const { userId, symbol, broker, side, quantity, price, tradeDate } =
      req.body;

    if (
      !userId ||
      !symbol ||
      !broker ||
      !side ||
      !quantity ||
      !price ||
      !tradeDate
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const trade = await Trade.create({
      userId,
      symbol,
      broker,
      side,
      quantity,
      price,
      tradeDate,
    });

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
