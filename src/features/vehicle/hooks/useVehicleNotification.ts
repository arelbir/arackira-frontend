import { useNotification } from "@/components/ui/notification";

/**
 * Araç modülü için özelleştirilmiş bildirim hook'u
 * Sık karşılaşılan hata ve durumlar için kullanıcı dostu mesajlar içerir
 */
export const useVehicleNotification = () => {
  const notification = useNotification();

  /**
   * Araç ekleme hatalarını kullanıcı dostu şekilde gösterir
   */
  const handleVehicleCreationError = (error: any) => {
    const errorMessage = error?.message || 'Araç eklenemedi';
    
    // Hata mesajına göre özelleştirilmiş mesajlar
    if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
      notification.error(
        'Bu plaka veya şasi numarasına sahip bir araç zaten mevcut.', 
        'Araç Eklenemedi'
      );
    } else if (errorMessage.includes('vehicle_chassis_number')) {
      notification.error(
        'Bu şasi numarası başka bir araç için zaten kullanılmakta. Lütfen kontrol edip tekrar deneyin.', 
        'Şasi Numarası Çakışması'
      );
    } else if (errorMessage.includes('null value in column')) {
      notification.error(
        'Bazı zorunlu alanlar eksik. Lütfen tüm gerekli alanları doldurun.', 
        'Eksik Bilgi'
      );
    } else {
      // Genel hata durumu
      notification.error(
        errorMessage, 
        'Araç İşlemi Başarısız'
      );
    }
  };

  /**
   * Araç güncelleme hatalarını kullanıcı dostu şekilde gösterir
   */
  const handleVehicleUpdateError = (error: any) => {
    const errorMessage = error?.message || 'Araç güncellenemedi';
    
    // Hata mesajına göre özelleştirilmiş mesajlar
    if (errorMessage.includes('duplicate key') || errorMessage.includes('unique constraint')) {
      notification.error(
        'Bu plaka veya şasi numarası başka bir araç için zaten kullanılmakta.', 
        'Araç Güncellenemedi'
      );
    } else {
      notification.error(
        errorMessage, 
        'Güncelleme Başarısız'
      );
    }
  };

  /**
   * Başarılı işlem bildirimleri
   */
  const vehicleCreatedSuccess = () => {
    notification.success(
      'Araç başarıyla eklendi.', 
      'İşlem Başarılı'
    );
  };

  const vehicleUpdatedSuccess = () => {
    notification.success(
      'Araç bilgileri başarıyla güncellendi.', 
      'Güncelleme Başarılı'
    );
  };

  const draftCreatedSuccess = () => {
    notification.success(
      'Araç taslağı oluşturuldu.', 
      'Taslak Kaydedildi'
    );
  };

  return {
    ...notification,
    handleVehicleCreationError,
    handleVehicleUpdateError,
    vehicleCreatedSuccess,
    vehicleUpdatedSuccess,
    draftCreatedSuccess
  };
};
