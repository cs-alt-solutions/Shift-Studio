/* src/utils/formatters.js */

export const formatCurrency = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(num);
};

export const formatPercent = (value, decimals = 1) => {
  const num = parseFloat(value);
  if (isNaN(num)) return '0.0%';
  return `${num.toFixed(decimals)}%`;
};

export const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  // Returns format like "Feb 11, 2026"
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatUnit = (qty, unit) => {
  return `${qty} ${unit}`;
};