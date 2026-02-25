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
/* Add to the bottom of src/utils/formatters.js */

// Extracts just the domain (e.g., "amazon.com") from a full URL string
export const getDomainFromUrl = (url) => {
    if (!url) return null;
    try {
      // Ensure it has a protocol so the URL object can parse it
      const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`;
      const { hostname } = new URL(urlWithProtocol);
      // Remove 'www.' for a cleaner look
      return hostname.replace(/^www\./, '');
    } catch {
       // If input isn't a valid URL, just return the raw input
       return url; 
    }
  };
  
// Generates a link to Google's favicon service for a given domain
export const getFaviconUrl = (domainOrUrl, size = 64) => {
    const domain = getDomainFromUrl(domainOrUrl);
    if (!domain) return null; // You might want a default placeholder image here
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
};