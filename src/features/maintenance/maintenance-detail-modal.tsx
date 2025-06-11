import React from 'react';
import { MaintenanceRecord } from './maintenance-list';

interface MaintenanceDetailModalProps {
  record: MaintenanceRecord | null;
  onClose: () => void;
}

const MaintenanceAvatar: React.FC<{ record: MaintenanceRecord }> = ({
  record
}) => {
  const text = record.description ? record.description[0].toUpperCase() : '?';
  return (
    <div className='bg-primary mr-3 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white'>
      {text}
    </div>
  );
};

const MaintenanceDetailModal: React.FC<MaintenanceDetailModalProps> = ({
  record,
  onClose
}) => {
  if (!record) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='max-w-[90vw] min-w-[320px] rounded-lg bg-white p-6 shadow-lg'>
        <div className='mb-4 flex items-center'>
          <MaintenanceAvatar record={record} />
          <div>
            <div className='text-lg font-bold'>
              Araç ID: {record.vehicle_id}
            </div>
            <div className='text-sm text-gray-500'>
              Açıklama: {record.description}
            </div>
          </div>
        </div>
        <div className='mb-2'>
          <b>Tarih:</b> {record.date}
        </div>
        <div className='mb-2'>
          <b>Tutar:</b> {record.cost} ₺
        </div>
        <div className='mb-2'>
          <b>Not:</b> {record.notes || '-'}
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

export default MaintenanceDetailModal;
