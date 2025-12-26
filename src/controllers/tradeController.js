import { Trade } from "../models/Trade.js";
import { User } from "../models/User.js";

// Create trade
export async function createTrade(req, res) {
  try {
    const { user, totalProfit, brokerage } = req.body;

    const exists = await User.findById(user);
    if (!exists) return res.status(404).json({ error: "User not found" });

    const trade = await Trade.create({ user, totalProfit, brokerage });
    res.status(201).json(trade);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// Get trades for a user (with optional date filter)
export async function getTradesForUser(req, res) {
  try {
    const { userId } = req.params;
    const { from, to } = req.query;

    const filter = { user: userId };

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const trades = await Trade.find(filter).sort({ createdAt: -1 });

    res.json(trades);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// Update a trade
export async function updateTrade(req, res) {
  try {
    const trade = await Trade.findByIdAndUpdate(req.params.tradeId, req.body, {
      new: true,
    });

    if (!trade) return res.status(404).json({ error: "Trade not found" });

    res.json(trade);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// Delete a trade
export async function deleteTrade(req, res) {
  try {
    const trade = await Trade.findByIdAndDelete(req.params.tradeId);

    if (!trade) return res.status(404).json({ error: "Trade not found" });

    res.json({ message: "Trade deleted" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
