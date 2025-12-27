import { User } from "../models/User.js";
import { Trade } from "../models/Trade.js";

export async function getUserSummary(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const trades = await Trade.find({ userId });

  const {
    tradeProfit,
    profitAfterBrokerage,
    commissionPaid,
    profitAfterCommission,
    brokerage,
  } = trades.reduce(
    (acc, el) => {
      acc.tradeProfit += el.tradeProfit;
      acc.profitAfterBrokerage += el.profitAfterBrokerage;
      acc.commissionPaid += el.commissionPaid;
      acc.profitAfterCommission += el.profitAfterCommission;
      acc.brokerage += el.brokerage;
      return acc;
    },
    {
      tradeProfit: 0,
      profitAfterBrokerage: 0,
      commissionPaid: 0,
      profitAfterCommission: 0,
      brokerage: 0,
    }
  );
  const taxAmt =
    profitAfterCommission > 0 && user.taxOnTotalProfit
      ? (profitAfterCommission * (user.taxRate || 0)) / 100
      : 0;
  const profitAfterTax = profitAfterCommission - taxAmt;

  return {
    user,
    tradeProfit,
    profitAfterBrokerage,
    commissionPaid,
    profitAfterCommission,
    brokerage,
    taxAmt,
    profitAfterTax,
  };
}

export const getAllUsersSummary = async (req, res) => {
  try {
    const report = await User.aggregate([
      // 1. Start with User and join Trades
      {
        $lookup: {
          from: "trades", // ensure this matches your actual collection name in MongoDB
          localField: "_id",
          foreignField: "userId",
          as: "userTrades",
        },
      },

      // 2. Calculate totals from the joined trades array
      {
        $addFields: {
          totalTradeProfit: { $sum: "$userTrades.tradeProfit" },
          totalProfitAfterBrokerage: {
            $sum: "$userTrades.profitAfterBrokerage",
          },
          totalCommission: { $sum: "$userTrades.commissionPaid" },
          totalProfitAfterCommission: {
            $sum: "$userTrades.profitAfterCommission",
          },
          totalBrokerage: { $sum: "$userTrades.brokerage" },
        },
      },

      // 3. Calculate Tax Amount (Logic: only if positive and tax enabled)
      {
        $addFields: {
          totalTaxAmt: {
            $cond: {
              if: {
                $and: [
                  { $gt: ["$totalProfitAfterCommission", 0] },
                  { $eq: ["$taxOnTotalProfit", true] },
                ],
              },
              then: {
                $multiply: [
                  "$totalProfitAfterCommission",
                  { $divide: [{ $ifNull: ["$taxRate", 0] }, 100] },
                ],
              },
              else: 0,
            },
          },
        },
      },

      // 4. Project Final Structure
      {
        $project: {
          _id: 0,
          user: {
            _id: "$_id",
            name: "$name", // Add other user fields you need here
            email: "$email",
            pan: "$pan",
            broker: "$broker",
            taxOnTotalProfit: 1,
            taxRate: 1,
          },
          totalTradeProfit: 1,
          totalProfitAfterBrokerage: 1,
          totalCommission: 1,
          totalProfitAfterCommission: 1,
          totalBrokerage: 1,
          totalTaxAmt: 1,
          totalProfitAfterTax: {
            $subtract: ["$totalProfitAfterCommission", "$totalTaxAmt"],
          },
        },
      },
    ]);

    // 5. Calculate Grand Totals (In-memory)
    const grandTotals = report.reduce(
      (acc, curr) => {
        acc.g_TradeProfit += curr.totalTradeProfit || 0;
        acc.g_TotalProfitAfterBrokerage += curr.totalProfitAfterBrokerage || 0;
        acc.g_TotalProfitAfterCommission +=
          curr.totalProfitAfterCommission || 0;
        acc.g_TotalCommission += curr.totalCommission || 0;
        acc.g_TotalBrokerage += curr.totalBrokerage || 0;
        acc.g_TotalTaxAmt += curr.totalTaxAmt || 0;
        acc.g_TotalProfitAfterTax += curr.totalProfitAfterTax || 0;
        return acc;
      },
      {
        g_TradeProfit: 0,
        g_TotalProfitAfterBrokerage: 0,
        g_TotalProfitAfterCommission: 0,
        g_TotalCommission: 0,
        g_TotalBrokerage: 0,
        g_TotalTaxAmt: 0,
        g_TotalProfitAfterTax: 0,
      }
    );

    return {
      users: report,
      grandTotals,
      userCount: report.length,
    };
  } catch (err) {
    console.error(err);
    return { users: [], grandTotals: {}, userCount: 0 };
  }
};
