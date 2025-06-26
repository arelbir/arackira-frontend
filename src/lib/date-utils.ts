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
