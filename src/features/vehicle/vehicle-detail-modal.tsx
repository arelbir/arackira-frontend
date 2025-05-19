import React from 'react';

export interface Vehicle {
  id: number;
  plate_number: string;
  brand: string;
  model: string;
  year: number;
  chassis_number?: string;
  current_status?: string;
  acquisition_cost?: string | number;
  acquisition_date?: string;
  notes?: string;
  [key: string]: any;
}

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

const VehicleAvatar: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
  const text = vehicle.brand ? vehicle.brand[0].toUpperCase() : '?';
  return (
    <div className='bg-primary mr-3 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white'>
      {text}
    </div>
  );
};

const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose
}) => {
  if (!vehicle) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='max-w-[90vw] min-w-[320px] rounded-lg bg-white p-6 shadow-lg'>
        <div className='mb-4 flex items-center'>
          <VehicleAvatar vehicle={vehicle} />
          <div>
            <div className='text-lg font-bold'>
              {vehicle.plate_number} - {vehicle.brand} {vehicle.model}
            </div>
            <div className='text-sm text-gray-500'>Yıl: {vehicle.year}</div>
          </div>
        </div>
        <div className='mb-2'>
          <b>Şasi No:</b> {vehicle.chassis_number || '-'}
        </div>
        <div className='mb-2'>
          <b>Durum:</b> {vehicle.current_status || '-'}
        </div>
        <div className='mb-2'>
          <b>Edinim Maliyeti:</b> {vehicle.acquisition_cost || '-'}
        </div>
        <div className='mb-2'>
          <b>Edinim Tarihi:</b> {vehicle.acquisition_date || '-'}
        </div>
        <div className='mb-2'>
          <b>Notlar:</b> {vehicle.notes || '-'}
        </div>
        <button
          onClick={onClose}
          className='mt-4 rounded bg-blue-600 px-4 py-2 text-white'
        >
          Kapat
        </button>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
