import User from "../models/User.js";
import Trade from "../models/Trade.js";
import { calculateUserCapitalGain } from "./capitalGain.service.js";

export const getDashboardSummary = async () => {
  const users = await User.find();

  let totalProfit = 0;
  let totalLoss = 0;
  let usersWithUnmatchedSells = [];

  for (const user of users) {
    const result = await calculateUserCapitalGain(user._id);

    if (result.totalProfit >= 0) {
      totalProfit += result.totalProfit;
    } else {
      totalLoss += result.totalProfit;
    }

    if (result.totalUnmatchedSellQty > 0) {
      usersWithUnmatchedSells.push({
        userId: user._id,
        unmatchedSellQty: result.totalUnmatchedSellQty,
      });
    }
  }

  return {
    totalUsers: users.length,
    totalProfit,
    totalLoss,
    netPnL: totalProfit + totalLoss,
    usersWithUnmatchedSells,
  };
};
