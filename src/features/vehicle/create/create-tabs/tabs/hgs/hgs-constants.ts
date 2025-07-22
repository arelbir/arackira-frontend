import { FieldArrayWithId } from 'react-hook-form';
import { VehicleFormValues } from '@/features/vehicle/schemas/vehicle.schemas';

// Shared type for HGS records to avoid circular dependencies
export type Hgs = FieldArrayWithId<VehicleFormValues, "hgs", "id">;

// UI messages for HGS module
export const HGS_MESSAGES = {
  SUCCESS: "HGS kaydı başarıyla kaydedildi",
  ERROR: "HGS kaydı oluşturulurken bir hata oluştu",
  DELETE_SUCCESS: "HGS kaydı başarıyla silindi",
  EDIT: "HGS Kaydını Düzenle",
  NEW: "Yeni HGS Kaydı Ekle",
  DELETE: "HGS kaydı silindi",
  DELETE_CONFIRM: "Bu HGS kaydını silmek istediğinizden emin misiniz?",
};

// Default values for a new HGS record
// This structure must be compatible with hgsSchema
export const NEW_HGS_RECORD = {
  hgs_place: '',
  hgs_tag_no: '',
  hgs_vehicle_class: '',
  is_active: true,
  loading_date: new Date(),
};
