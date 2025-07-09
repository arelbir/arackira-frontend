import { useSWRConfig } from 'swr';
import { toast } from 'sonner';
import { VehicleCreateInput } from './schema';

import { apiFetcher } from '@/lib/api';

// Draft creation (POST, returns id)
async function createDraftFetcher(arg: { chassis_number: string; is_draft: boolean }) {
  return apiFetcher('/api/vehicles', {
    method: 'POST',
    body: JSON.stringify({
      chassis_number: arg.chassis_number,
      is_draft: true
    }),
    headers: { 'Content-Type': 'application/json' }
  });
}

// Backend'in kabul ettiği araç alanları (vehicles.model.js dosyasından alındı)
const VEHICLE_WHITELIST_FIELDS = [
  'id',
  'plate_number',
  'branch_id',
  'vehicle_type_id',
  'brand_id',
  'model_id',
  'version',
  'package',
  'vehicle_group_id',
  'body_type',
  'fuel_type_id',
  'transmission_id',
  'model_year',
  'color_id',
  'engine_power_hp',
  'engine_volume_cc',
  'chassis_number',
  'engine_number',
  'first_registration_date',
  'registration_document_number',
  'vehicle_responsible_id',
  'vehicle_km',
  'next_maintenance_date',
  'inspection_expiry_date',
  'insurance_expiry_date',
  'casco_expiry_date',
  'exhaust_stamp_expiry_date',
  'vehicle_status_id',
  'tsb_code',
  'is_draft'
];

// Full update (PUT by id)
async function updateVehicleFetcher(vehicleId: number, arg: VehicleCreateInput) {
  // Tarih alanlarını detaylı logla - hata ayıklama için
  console.log('=== VEHICLE UPDATE PAYLOAD DEBUGGING ===');
  console.log('Gelen payload:', arg);
  
  // 1. Sadece backend'in beklediği alanları içeren temiz bir nesne oluştur (whitelist)
  const whitelistedArg: Record<string, any> = {};
  
  // 2. Sadece whitelist'teki alanları ekle
  VEHICLE_WHITELIST_FIELDS.forEach(field => {
    if (field in arg) {
      // @ts-ignore - Dinamik field erişimi için
      whitelistedArg[field] = arg[field];
    }
  });
  
  // 3. Tüm tarih alanlarını boş string ('') yerine null olarak dönüştür
  if (whitelistedArg.insurance_expiry_date === '') whitelistedArg.insurance_expiry_date = null;
  if (whitelistedArg.casco_expiry_date === '') whitelistedArg.casco_expiry_date = null;
  if (whitelistedArg.first_registration_date === '') whitelistedArg.first_registration_date = null;
  if (whitelistedArg.next_maintenance_date === '') whitelistedArg.next_maintenance_date = null;
  if (whitelistedArg.inspection_expiry_date === '') whitelistedArg.inspection_expiry_date = null;
  if (whitelistedArg.exhaust_stamp_expiry_date === '') whitelistedArg.exhaust_stamp_expiry_date = null;
  
  console.log('Filtrelenmiş ve düzeltilmiş payload:', whitelistedArg);
  console.log('=== DEBUG LOG END ===');
  
  return apiFetcher(`/api/vehicles/${vehicleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(whitelistedArg),
  });
}

export function useVehicleCreate() {
  const { mutate } = useSWRConfig();
  // Draft save
  const createDraft = async (data: { chassis_number: string }) => {
    try {
      const result = await createDraftFetcher({
        chassis_number: data.chassis_number,
        is_draft: true,
      });
      toast.success('Taslak başarıyla oluşturuldu');
      mutate('/api/vehicles');
      return result;
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };
  // Full save/update
  const updateVehicle = async (vehicleId: number, data: VehicleCreateInput) => {
    try {
      const result = await updateVehicleFetcher(vehicleId, data);
      toast.success('Araç başarıyla kaydedildi');
      mutate('/api/vehicles');
      return result;
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };
  return { createDraft, updateVehicle };
}
