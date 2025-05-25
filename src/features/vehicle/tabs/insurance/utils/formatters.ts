/**
 * Tarih formatlama yardımcı fonksiyonları
 */

/**
 * Tarih string'ini Türkçe formatına dönüştürür
 * @param dateStr Tarih string'i (ISO formatı)
 * @returns Formatlanmış tarih string'i veya "-" (tarih yoksa)
 */
export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return "-";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR');
  } catch (e) {
    console.error('Tarih formatlamada hata:', e);
    return dateStr || "-";
  }
};

/**
 * Sayısal değeri para birimi formatına dönüştürür
 * @param amount Tutar (sayı veya string olabilir)
 * @param currency Para birimi kodu
 * @returns Formatlanmış para birimi string'i veya "-" (tutar yoksa)
 */
export const formatCurrency = (amount: number | string | undefined, currency: string = "TL"): string => {
  if (amount === undefined || amount === null) return "-";
  
  try {
    const numericAmount = typeof amount === 'string' ? Number(amount) : amount;
    return `${numericAmount.toLocaleString('tr-TR')} ${currency}`;
  } catch (e) {
    console.error('Para birimi formatlamada hata:', e);
    return `${amount} ${currency}`;
  }
};
