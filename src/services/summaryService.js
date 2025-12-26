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

  return {
    tradeProfit,
    profitAfterBrokerage,
    commissionPaid,
    profitAfterCommission,
    brokerage,
  };
}

export const getAllUsersSummary = async (req, res) => {
  try {
    const report = await Trade.aggregate([
      // 1. Group trades by user to compress data
      {
        $group: {
          _id: "$userId",
          totalTradeProfit: { $sum: "$tradeProfit" },
          totalProfitAfterBrokerage: { $sum: "$profitAfterBrokerage" },
          totalCommission: { $sum: "$commissionPaid" },
          totalProfitAfterCommission: { $sum: "$profitAfterCommission" },
          totalBrokerage: { $sum: "$brokerage" },
        },
      },

      // 2. Join with the User collection
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },

      // 3. Calculate Tax Amount and Net Profit after tax (Logic: only if positive and payee)
      {
        $addFields: {
          totalTaxAmt: {
            $cond: {
              if: {
                $and: [
                  { $gt: ["$totalProfitAfterCommission", 0] },
                  { $eq: ["$userDetails.taxOnTotalProfit", true] },
                ],
              },
              then: {
                $multiply: [
                  "$totalProfitAfterCommission",
                  { $divide: [{ $ifNull: ["$userDetails.taxRate", 0] }, 100] },
                ],
              },
              else: 0,
            },
          },
        },
      },

      // 4. Project Final Fields
      {
        $project: {
          _id: 0,
          user: "$userDetails",
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

    // 5. Calculate Grand Totals using reduce (In-memory)
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

    const finalObject = {
      users: report,
      grandTotals,
      userCount: report.length,
    };

    return finalObject;
  } catch (err) {
    return {};
  }
};
