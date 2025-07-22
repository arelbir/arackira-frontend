import { FieldArrayWithId } from 'react-hook-form';
import { VehicleFormValues } from '@/features/vehicle/schemas/vehicle.schemas';

// Shared type for GPS records to avoid circular dependencies
export type Gps = FieldArrayWithId<VehicleFormValues, "gps", "id">;

// UI messages for GPS module
export const GPS_MESSAGES = {
  SUCCESS: "GPS kaydı başarıyla kaydedildi.",
  ERROR: "GPS kaydı kaydedilirken bir hata oluştu.",
  DELETE_SUCCESS: "GPS kaydı başarıyla silindi.",
  NEW: "Yeni GPS Kaydı",
  EDIT: "GPS Kaydını Düzenle",
  delete: "Sil",
  deleteTitle: "Kaydı Silmek Üzeresiniz",
  deleteMessage: "Bu GPS kaydını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
  cancel: "İptal",
};

// Default values for a new GPS record, compatible with gpsSchema
export const NEW_GPS_RECORD = {
  gps_tracking_status: true,
  brand: '',
  installation_date: null,
  sim_number: '',
  device_model: '',
  device_serial_number: '',
  subscription_start: null,
  subscription_end: null,
  service_provider: '',
  description: '',
  is_active: true,
  last_update: null,
  installation_location: '',
  cancellation_date: null,
  created_at: null,
  updated_at: null,
};



export const GPS_DEFAULT_VALUES = {
  id: undefined,
  gps_tracking_status: '',
  brand: '',
  device_model: '',
  installation_date: null,
  sim_number: '',
  device_serial_number: '',
  service_provider: '',
  subscription_start: null,
  subscription_end: null,
  installation_location: '',
  description: '',
  is_active: true,
};
