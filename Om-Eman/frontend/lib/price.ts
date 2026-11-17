// Price display helpers (C3) — presentation only. Backend money always arrives
// as decimal strings ("45.0000"); no business totals are computed here.

// Integer percent saved when compareAt exceeds price, else null. Savings
// below 1% (rounded to 0) also return null so the UI never claims a
// "saved 0%" discount that does not exist (D2-07).
export const calculateSavingsPercent = (price: string, compareAt: string): number | null => {
  const current = Number(price);
  const original = Number(compareAt);
  if (!Number.isFinite(current) || !Number.isFinite(original) || original <= current) {
    return null;
  }
  const percent = Math.round(((original - current) / original) * 100);
  return percent >= 1 ? percent : null;
};

// Whole numbers render without decimals ("45.0000" -> "45"); fractional ones
// keep two decimals ("45.5000" -> "45.50").
export const formatPriceAmount = (value: string): string => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;
  return Number.isInteger(amount) ? `${amount}` : amount.toFixed(2);
};
