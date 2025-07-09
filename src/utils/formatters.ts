// Date formatting utilities

/**
 * Format a date string to DD.MM.YYYY format
 * @param date - ISO date string or null
 * @returns Formatted date string or '-' if date is null/invalid
 */
export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    return dateObj.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};

/**
 * Format a number as currency with Turkish Lira symbol
 * @param value - Number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-';
  
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(value);
};
