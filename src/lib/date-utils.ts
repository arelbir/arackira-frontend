// Tarih işlemleri için yardımcı fonksiyonlar
export function getCurrentDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function getNewDate(date: string, months: number): string {
  if (!date) return "";
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate.toISOString().split('T')[0];
}

// Tarih aralığı kontrolü
export function isDateInRange(date: string | Date | null | undefined, days: number): boolean {
  if (!date) return false;
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  if (!(checkDate instanceof Date) || isNaN(checkDate.getTime())) return false;
  
  const today = new Date();
  const diffTime = checkDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 && diffDays <= days;
}

// Tarihin geçip geçmediğini kontrol et
export function isDateExpired(date: string | Date | null | undefined): boolean {
  if (!date) return false;
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  if (!(checkDate instanceof Date) || isNaN(checkDate.getTime())) return false;
  
  const today = new Date();
  return checkDate.getTime() < today.getTime();
}

/**
 * API'dan gelen tarih string'ini form için uygun formata çevirir (YYYY-MM-DD)
 * @param dateString - API'dan gelen ISO formatında tarih
 * @returns Form için uygun formatta tarih (YYYY-MM-DD) veya undefined
 */
export function formatDateForForm(dateString: string | undefined): string | undefined {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch {
    return undefined;
  }
}

/**
 * Form tarih değerini API için uygun formata çevirir (ISO format)
 * @param dateString - Form formatında tarih (YYYY-MM-DD)
 * @returns API için uygun formatta tarih (ISO) veya undefined
 */
export function formatDateForAPI(dateString: string | undefined): string | undefined {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString();
  } catch {
    return undefined;
  }
}

/**
 * Tarih string'ini kullanıcı arayüzü için Türkçe formatına çevirir (DD.MM.YYYY)
 * @param dateString - Herhangi bir formattaki tarih string'i
 * @returns Türkçe formatta tarih (DD.MM.YYYY) veya "-"
 */
export function formatDateForDisplay(dateString: string | undefined): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return "-";
  }
}
