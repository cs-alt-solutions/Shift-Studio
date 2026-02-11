/* src/utils/validators.js */

export const isValidPrice = (val) => {
  const num = parseFloat(val);
  return !isNaN(num) && num >= 0;
};

export const isValidQuantity = (val) => {
  const num = parseFloat(val);
  return !isNaN(num) && num >= 0;
};

export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  // Basic protection: removes HTML tags to prevent injection
  return str.replace(/[<>]/g, '').trim();
};