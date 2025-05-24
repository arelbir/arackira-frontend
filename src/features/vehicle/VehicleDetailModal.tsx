import React from 'react';

import { VehicleFormValues } from './vehicle-schema';

interface VehicleDetailModalProps {
  vehicle: VehicleFormValues | null;
  onClose: () => void;
}

const getLabel = (options: { label: string; value: any }[], value: any) => {
  const found = options.find((o) => o.value === value);
  return found ? found.label : '-';
};

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({ vehicle, onClose }) => {
  

  if (!vehicle) return null;
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-w-[600px] w-full rounded-lg bg-white p-6 shadow-lg relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black">Kapat</button>
        <h2 className="text-xl font-bold mb-4">Araç Detayı</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><b>Plaka:</b> {vehicle.plate_number}</div>
          <div><b>Şube:</b> {vehicle.branch_id}</div>
          <div><b>Cins:</b> {vehicle.vehicle_type_id}</div>
          <div><b>Marka:</b> {vehicle.brand_id}</div>
          <div><b>Model:</b> {vehicle.model_id}</div>
          <div><b>Versiyon:</b> {vehicle.version}</div>
          <div><b>Paket:</b> {vehicle.package}</div>
          <div><b>Grup:</b> {vehicle.vehicle_group_id}</div>
          <div><b>Kasa Tipi:</b> {vehicle.body_type}</div>
          <div><b>Yakıt Tipi:</b> {vehicle.fuel_type_id}</div>
          <div><b>Vites Tipi:</b> {vehicle.transmission_id}</div>
          <div><b>Model Yılı:</b> {vehicle.model_year}</div>
          <div><b>Renk:</b> {vehicle.color_id}</div>
          <div><b>Motor Gücü (hp):</b> {vehicle.engine_power_hp}</div>
          <div><b>Motor Hacmi (cc):</b> {vehicle.engine_volume_cc}</div>
          <div><b>Şasi No:</b> {vehicle.chassis_number}</div>
          <div><b>Motor No:</b> {vehicle.engine_number}</div>
          <div><b>İlk Tescil Tarihi:</b> {vehicle.first_registration_date}</div>
          <div><b>Ruhsat Belge No:</b> {vehicle.registration_document_number}</div>
          <div><b>Satın Alma Tarihi:</b> {vehicle.acquisition_date}</div>
          <div><b>Satın Alma Maliyeti:</b> {vehicle.acquisition_cost}</div>
          <div><b>Araç Sorumlusu:</b> {vehicle.vehicle_responsible_id}</div>
          <div><b>Müşteri:</b> {vehicle.current_client_company_id}</div>
          <div><b>Araç KM:</b> {vehicle.vehicle_km}</div>
          <div><b>Sonraki Bakım Tarihi:</b> {vehicle.next_maintenance_date}</div>
          <div><b>Muayene Bitiş Tarihi:</b> {vehicle.inspection_expiry_date}</div>
          <div><b>Sigorta Bitiş Tarihi:</b> {vehicle.insurance_expiry_date}</div>
          <div><b>Kasko Bitiş Tarihi:</b> {vehicle.casco_expiry_date}</div>
          <div><b>Egzoz Pulu Bitiş Tarihi:</b> {vehicle.exhaust_stamp_expiry_date}</div>
          <div><b>Durum:</b> {vehicle.current_status}</div>
          <div className="md:col-span-2"><b>Notlar:</b> {vehicle.notes}</div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
