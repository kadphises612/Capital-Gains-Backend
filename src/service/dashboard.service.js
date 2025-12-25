import User from "../models/User.js";
import { getUserSummaryService } from "./userSummary.service.js";

export const getDashboardSummary = async () => {
  const users = await User.find();
  let totalTrades = 0;
  let totalGrossProfit = 0;
  let totalBrokerage = 0;
  let totalNetProfit = 0;

  for (const user of users) {
    const {
      total_trades: u_total_trades,
      gross_profit: u_gross_profit,
      total_tax_and_fees: u_total_tax_and_fees,
      net_profit: u_net_profit,
    } = await getUserSummaryService(user._id);
    totalTrades += u_total_trades;
    totalBrokerage += u_total_tax_and_fees;
    totalGrossProfit += u_gross_profit;
    totalNetProfit += u_net_profit;
  }

  return {
    totalUsers: users.length,
    totalTrades,
    totalGrossProfit,
    totalBrokerage,
    totalNetProfit,
  };
};
