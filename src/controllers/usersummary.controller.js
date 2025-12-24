import UserSummary from "../models/UserSummary.js";

export const getUserSummary = async (req, res) => {
  const summary = await UserSummary.findOne({
    userId: req.params.userId,
  });

  res.json(
    summary || {
      total_trades: 0,
      gross_profit: 0,
      total_tax_and_fees: 0,
      net_profit: 0,
    }
  );
};
