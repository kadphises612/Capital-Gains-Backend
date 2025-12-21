import Trade from "../models/Trade.js";

export const calculateCapitalGain = async (userId, symbol) => {
  const trades = await Trade.find({
    userId,
    symbol: symbol.toUpperCase(),
  }).sort({ tradeDate: 1 });

  let buyQueue = [];
  let totalProfit = 0;

  for (const trade of trades) {
    if (trade.side === "BUY") {
      buyQueue.push({
        quantity: trade.quantity,
        price: trade.price,
      });
    }

    if (trade.side === "SELL") {
      let sellQty = trade.quantity;
      let sellPrice = trade.price;

      while (sellQty > 0 && buyQueue.length > 0) {
        const buy = buyQueue[0];

        const matchedQty = Math.min(sellQty, buy.quantity);
        totalProfit += (sellPrice - buy.price) * matchedQty;

        buy.quantity -= matchedQty;
        sellQty -= matchedQty;

        if (buy.quantity === 0) {
          buyQueue.shift(); // remove used BUY
        }
      }
    }
  }

  return {
    symbol,
    totalProfit,
  };
};

export const calculateUserCapitalGain = async (userId) => {
  const symbols = await Trade.distinct("symbol", { userId });

  let summary = [];
  let totalProfit = 0;
  let totalUnmatchedSellQty = 0;

  for (const symbol of symbols) {
    const result = await calculateCapitalGain(userId, symbol);

    summary.push(result);
    totalProfit += result.totalProfit;
    totalUnmatchedSellQty += result.unmatchedSellQty;
  }

  return {
    userId,
    totalProfit,
    totalUnmatchedSellQty,
    breakdown: summary,
  };
};
