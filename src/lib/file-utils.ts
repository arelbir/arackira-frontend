/**
 * @file file-utils.ts
 * @description Dosya işlemleri için yardımcı fonksiyonlar
 */

/**
 * API yanıtından dosya indirme işlemi
 * @param blob İndirilecek dosya blobu
 * @param filename Dosya adı
 */
export const downloadFileFromResponse = (blob: Blob, filename: string) => {
  // URL oluştur
  const url = window.URL.createObjectURL(blob);
  
  // Link oluştur ve tıkla
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Temizle
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Dosya uzantısından MIME türünü belirleme
 * @param extension Dosya uzantısı ('.xlsx', '.csv', vs.)
 */
export const getMimeTypeFromExtension = (extension: string): string => {
  const extensionMap: Record<string, string> = {
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
    '.csv': 'text/csv',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.txt': 'text/plain'
  };
  
  return extensionMap[extension.toLowerCase()] || 'application/octet-stream';
};

/**
 * Dosya boyutunu okunabilir formata çevirme
 * @param bytes Dosya boyutu (byte)
 * @param decimals Ondalık basamak sayısı
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
