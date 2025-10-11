const LKR_FORMATTER = new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 });

export function formatCurrencyLKR(amount: number): string {
  return LKR_FORMATTER.format(amount);
}


