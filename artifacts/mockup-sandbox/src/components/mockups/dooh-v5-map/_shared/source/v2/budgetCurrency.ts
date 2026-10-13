export type BudgetCurrency = "GBP" | "EUR" | "USD";

// Fixed prototype rates, expressed as selected-currency units per GBP.
export const EXCHANGE_RATES: Record<BudgetCurrency, number> = { GBP: 1, EUR: 1.17, USD: 1.25 };
export const CURRENCY_SYMBOLS: Record<BudgetCurrency, string> = { GBP: "£", EUR: "€", USD: "$" };

export function convertBudgetCurrency<T extends {
  currency: BudgetCurrency;
  total: number | "";
  cpm: number | "" | null;
}>(budget: T, currency: BudgetCurrency): T {
  if (budget.currency === currency) return budget;
  const ratio = EXCHANGE_RATES[currency] / EXCHANGE_RATES[budget.currency];
  const convert = (value: number) => Math.round((value * ratio + Number.EPSILON) * 100) / 100;
  return {
    ...budget,
    currency,
    total: budget.total === "" ? "" : convert(budget.total),
    cpm: budget.cpm === null || budget.cpm === "" ? budget.cpm : convert(budget.cpm),
  };
}
