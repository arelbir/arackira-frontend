import React from 'react';
import CustomerAvatar from './customer-avatar';
import { Customer } from './customer-list';

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  onClose
}) => (
  <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
    <div className='max-w-[90vw] min-w-[320px] rounded-lg bg-white p-6 shadow-lg'>
      <div className='mb-4 flex items-center'>
        <CustomerAvatar name={customer.company_name} />
        <div>
          <div className='text-lg font-bold'>{customer.company_name}</div>
          <div className='text-sm text-gray-500'>
            Yetkili: {customer.contact_person}
          </div>
        </div>
      </div>
      <div className='mb-2'>
        <b>E-posta:</b> {customer.email}
      </div>
      <div className='mb-2'>
        <b>Telefon:</b> {customer.phone}
      </div>
      <div className='mb-2'>
        <b>Adres:</b> {customer.address}
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

export default CustomerDetailModal;
