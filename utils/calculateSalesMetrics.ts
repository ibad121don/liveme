// utils/calculateSalesMetrics.ts

export function calculateSalesMetrics(sales: any[]) {
  let totalRevenue = 0;
  let totalProfit = 0;

  sales.forEach((s) => {
    const revenueFromBreaks =
      s.salesBreak?.reduce(
        (acc: number, item: any) => acc + (item.totalCost || 0),
        0
      ) || 0;
    const revenueFromDirect =
      s.directSale?.reduce(
        (acc: number, item: any) => acc + (item.subtotal || 0),
        0
      ) || 0;

    const profitFromBreaks =
      s.salesBreak?.reduce(
        (acc: number, item: any) => acc + (item.estimatedProfit || 0),
        0
      ) || 0;
    const profitFromDirect =
      s.directSale?.reduce(
        (acc: number, item: any) => acc + (item.estimatedProfit || 0),
        0
      ) || 0;

    totalRevenue += revenueFromBreaks + revenueFromDirect;
    totalProfit += profitFromBreaks + profitFromDirect;
  });

  return { totalRevenue, totalProfit };
}
