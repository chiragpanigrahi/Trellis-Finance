export const formatCurrency = (amount, currency = 'USD', compact = false) => {
  if (amount == null) return '--';
  const n = parseFloat(amount);
  if (compact) {
    if (Math.abs(n) >= 1_000_000) return `${sym(currency)}${(n/1_000_000).toFixed(2)}M`;
    if (Math.abs(n) >= 1_000)     return `${sym(currency)}${(n/1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style:'currency', currency, minimumFractionDigits:2, maximumFractionDigits:2,
  }).format(n);
};

const sym = c => ({ USD:'$', EUR:'€', GBP:'£', JPY:'¥', CHF:'Fr' }[c] ?? c);

export const formatNumber = (n, d=2) =>
  n == null ? '--' : new Intl.NumberFormat('en-US',{minimumFractionDigits:d,maximumFractionDigits:d}).format(parseFloat(n));
