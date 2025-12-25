import UserSummary from "../models/UserSummary.js";

export const getUserSummaryService = async (userId) => {
  const summary = await UserSummary.findOne({
    userId,
  });

  return (
    summary || {
      total_trades: 0,
      gross_profit: 0,
      total_tax_and_fees: 0,
      net_profit_ctake: 0,
      net_profit: 0,
    }
  );
};
