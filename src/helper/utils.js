export const getTradeMetadata = (
  user,
  { sell_price, buy_price, quantity, brokerage }
) => {
  // Calculate trade profit
  const tradeProfit = (sell_price - buy_price) * quantity;
  // Calculate profit after deducting brokerage
  const profitAfterBrokerage = tradeProfit - brokerage;
  // Calculate commission paid based on user settings
  const commissionPaid =
    user.commissionPerTrade && profitAfterBrokerage > 0
      ? profitAfterBrokerage * (user.commissionRate / 100)
      : 0;

  const profitAfterCommission = profitAfterBrokerage - commissionPaid;

  return {
    tradeProfit,
    profitAfterBrokerage,
    commissionPaid,
    profitAfterCommission,
    brokerage,
  };
};
