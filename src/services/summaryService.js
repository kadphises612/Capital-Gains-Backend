import { User } from "../models/User.js";
import { Trade } from "../models/Trade.js";
import mongoose from "mongoose";

export async function getUserSummary(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const trades = await Trade.find({ userId });

  const grossAfterBrokerage = trades.reduce(
    (sum, t) => sum + (t.totalProfit - t.brokerage),
    0
  );

  let commission = 0;
  if (
    user.commissionPerTrade &&
    user.commissionRate > 0 &&
    grossAfterBrokerage > 0
  ) {
    commission = grossAfterBrokerage * (user.commissionRate / 100);
  }

  const afterCommission = grossAfterBrokerage - commission;

  let tax = 0;
  if (user.taxOnTotalProfit && user.taxRate > 0 && afterCommission > 0) {
    tax = afterCommission * (user.taxRate / 100);
  }

  console.log("afterCommission", afterCommission);

  const netProfit = afterCommission - tax;

  return {
    userId,
    name: user.fullName,
    grossAfterBrokerage,
    commission,
    tax,
    netProfit,
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
