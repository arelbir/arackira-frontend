import React from 'react';
import { DisposalRecord } from './disposalService';

interface DisposalDetailModalProps {
  record: DisposalRecord;
  onClose: () => void;
}

const DisposalAvatar: React.FC<{ record: DisposalRecord }> = ({ record }) => {
  const text = record.disposal_type
    ? record.disposal_type[0].toUpperCase()
    : '?';
  return (
    <div className='bg-primary mr-3 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white'>
      {text}
    </div>
  );
};

const DisposalDetailModal: React.FC<DisposalDetailModalProps> = ({
  record,
  onClose
}) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='max-w-[90vw] min-w-[320px] rounded-lg bg-white p-6 shadow-lg'>
        <button
          onClick={onClose}
          className='text-muted-foreground hover:text-foreground absolute top-4 right-4 text-xl'
        >
          &times;
        </button>
        <div className='mb-4 flex items-center'>
          <DisposalAvatar record={record} />
          <div>
            <div className='text-lg font-bold'>
              Araç ID: {record.vehicle_id}
            </div>
            <div className='text-sm text-gray-500'>
              Tür:{' '}
              {record.disposal_type === 'sold'
                ? 'Satıldı'
                : record.disposal_type === 'scrapped'
                  ? 'Hurda'
                  : record.disposal_type}
            </div>
          </div>
        </div>
        <div className='mb-2'>
          <b>Tarih:</b> {record.disposal_date?.slice(0, 10)}
        </div>
        <div className='mb-2'>
          <b>Tutar:</b> {record.amount !== undefined ? record.amount : '-'}
        </div>
        <div className='mb-2'>
          <b>Not:</b> {record.notes || '-'}
        </div>
        <div className='mb-2'>
          <b>Oluşturulma:</b> {record.created_at?.slice(0, 10)}
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

export default DisposalDetailModal;
