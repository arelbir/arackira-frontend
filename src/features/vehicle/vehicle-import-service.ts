/**
 * @file vehicle-import-service.ts
 * @description Araçlar için toplu içe/dışa aktarım işlemlerini yöneten servis
 */

// Dosya yardımcı fonksiyonları

/**
 * API yanıtından dosya indirme işlemi
 * @param blob İndirilecek dosya blobu
 * @param filename Dosya adı
 */
const downloadFileFromResponse = (blob: Blob, filename: string) => {
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
 * İçe aktarılan araçların sonuç tipi
 */
export interface VehicleImportResult {
  success: boolean;
  message: string;
  inserted: number;
  failed: number;
  errorReport: {
    filename: string;
    buffer: string;
  } | null;
}

/**
 * Araçlar için toplu içe aktarım servisi
 */
export const useVehicleImportService = () => {
  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:4000/api/vehicles';

  /**
   * Excel şablonunu indir
   */
  const downloadTemplate = async () => {
    try {
      const response = await fetch(`${API_URL}/import/template`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Excel şablonu indirilemedi');
      }

      // Dosyayı indirme işlemi
      const blob = await response.blob();
      const filename = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 
                      `arac_veri_aktarimi_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      downloadFileFromResponse(blob, filename);
      return true;
    } catch (error) {
      console.error('Şablon indirme hatası:', error);
      throw error;
    }
  };

  /**
   * Excel dosyasını yükleyerek verileri içe aktar
   * @param file Excel dosyası
   */
  const importVehicles = async (file: File): Promise<VehicleImportResult> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/import`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'İçe aktarma işlemi başarısız oldu');
      }

      const result = await response.json() as VehicleImportResult;
      
      // Hata raporu varsa indirme işlemi için hazırla
      if (result.errorReport) {
        const { filename, buffer } = result.errorReport;
        
        // Base64'ten Blob'a dönüştür
        const byteCharacters = atob(buffer);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        
        // Dosyayı indir
        downloadFileFromResponse(blob, filename);
      }
      
      return result;
    } catch (error) {
      console.error('İçe aktarma hatası:', error);
      throw error;
    }
  };

  return {
    downloadTemplate,
    importVehicles
  };
};
