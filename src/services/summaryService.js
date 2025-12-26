import { User } from "../models/User.js";
import { Trade } from "../models/Trade.js";

export async function getUserSummary(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const trades = await Trade.find({ userId });

  const {
    transactionProfit,
    totalProfit,
    commissionPaid,
    netProfit,
    brokerage,
  } = trades.reduce(
    (acc, el) => {
      acc.transactionProfit += el.transactionProfit;
      acc.totalProfit += el.totalProfit;
      acc.commissionPaid += el.commissionPaid;
      acc.netProfit += el.netProfit;
      acc.brokerage += el.brokerage;
      return acc;
    },
    {
      transactionProfit: 0,
      totalProfit: 0,
      commissionPaid: 0,
      netProfit: 0,
      brokerage: 0,
    }
  );

  return {
    transactionProfit,
    totalProfit,
    commissionPaid,
    netProfit,
    brokerage,
  };
}

export async function getAllUsersSummary() {
  return Trade.aggregate([
    {
      $group: {
        _id: "$user",
        grossAfterBrokerage: {
          $sum: { $subtract: ["$totalProfit", "$brokerage"] },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $addFields: {
        commission: {
          $cond: [
            {
              $and: [
                "$user.commissionPerTrade",
                { $gt: ["$user.commissionRate", 0] },
              ],
            },
            { $multiply: ["$grossAfterBrokerage", "$user.commissionRate"] },
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        afterCommission: { $subtract: ["$grossAfterBrokerage", "$commission"] },
      },
    },
    {
      $addFields: {
        tax: {
          $cond: [
            { $and: ["$user.taxOnTotalProfit", { $gt: ["$user.taxRate", 0] }] },
            { $multiply: ["$afterCommission", "$user.taxRate"] },
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        netProfit: { $subtract: ["$afterCommission", "$tax"] },
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$user._id",
        name: "$user.fullName",
        grossAfterBrokerage: 1,
        commission: 1,
        tax: 1,
        netProfit: 1,
      },
    },
  ]);
}
