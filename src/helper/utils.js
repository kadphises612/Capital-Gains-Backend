export const getTradeMetadata = (
  user,
  { sell_price, buy_price, quantity, brokerage }
) => {
    // Calculate transaction profit
  const transactionProfit = (sell_price - buy_price) * quantity;
// Calculate total profit after deducting brokerage
  const totalProfit = transactionProfit - brokerage;
// Calculate commission paid based on user settings
  const commissionPaid =
    user.commissionPerTrade && totalProfit > 0
      ? totalProfit * (user.commissionRate / 100)
      : 0;
  const netProfit = totalProfit - commissionPaid;

  return {
    transactionProfit,
    totalProfit,
    commissionPaid,
    netProfit,
  };
};
