/* src/utils/formatters.js */
export const formatCurrency = (val) => {
  const number = parseFloat(val);
  if (isNaN(number)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number);
};

export const formatPercent = (val) => {
  const number = parseFloat(val);
  if (isNaN(number)) return '0%';
  return `${number.toFixed(1)}%`;
};