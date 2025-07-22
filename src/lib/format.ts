export function formatDate(
  date: Date | string | number | undefined | null,
  opts: Intl.DateTimeFormatOptions = {}
): string {
  if (!date) {
    return "—";
  }

  try {
    const d = new Date(date);
    // Check if the date is valid
    if (isNaN(d.getTime())) {
      return "—";
    }
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...opts
    }).format(d);
  } catch (_err) {
    return "—";
  }
}

export function formatCurrency(
  amount: number | string | undefined | null,
  currency: string | undefined | null = 'TRY'
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (numAmount == null || isNaN(numAmount) || !currency) {
    return "—";
  }

  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numAmount);
}
