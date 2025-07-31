import dayjs from "dayjs";

function getMonthlyRevenueProfit(sales: any[]) {
  const monthly: Record<string, { revenue: number; profit: number }> = {};

  for (const sale of sales) {
    const month = dayjs(sale.createdAt).format("YYYY-MM");
    const price =
      typeof sale.price === "string" ? parseFloat(sale.price) : sale.price;
    const cost =
      typeof sale.cost === "string" ? parseFloat(sale.cost) : sale.cost;
    const profit = price - cost;

    if (!monthly[month]) {
      monthly[month] = { revenue: 0, profit: 0 };
    }

    monthly[month].revenue += price;
    monthly[month].profit += profit;
  }

  // Return as array sorted by month
  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { revenue, profit }]) => ({
      month,
      revenue,
      profit,
    }));
}
