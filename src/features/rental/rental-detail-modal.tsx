// Kiralama detay modalı - MaintenanceDetailModal örnek alınarak
import React from 'react';
import { RentalRecord } from './rentalService';

interface RentalDetailModalProps {
  record: RentalRecord;
  onClose: () => void;
}

const RentalDetailModal: React.FC<RentalDetailModalProps> = ({
  record,
  onClose
}) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='fixed inset-0 bg-black/40 transition-opacity'
        onClick={onClose}
      />
      <div className='bg-background relative z-10 max-w-md min-w-[320px] rounded-xl p-8 shadow-lg'>
        <button
          onClick={onClose}
          className='text-muted-foreground hover:text-foreground absolute top-4 right-4 text-xl'
        >
          &times;
        </button>
        <h2 className='text-foreground mb-4 text-xl font-bold'>
          Kiralama Detayı
        </h2>
        <div className='flex flex-col gap-2 text-sm'>
          <div>
            <b>Araç ID:</b> {record.vehicle_id}
          </div>
          <div>
            <b>Müşteri (Şirket ID):</b> {record.client_company_id}
          </div>
          <div>
            <b>Sözleşme No:</b> {record.contract_number}
          </div>
          <div>
            <b>Başlangıç:</b> {record.start_date?.slice(0, 10)}
          </div>
          <div>
            <b>Bitiş:</b> {record.end_date?.slice(0, 10)}
          </div>
          <div>
            <b>Durum:</b> {record.status}
          </div>
          <div>
            <b>Açıklama:</b> {record.terms || '-'}
          </div>
          <div>
            <b>Oluşturulma:</b> {record.created_at?.slice(0, 10)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetailModal;
