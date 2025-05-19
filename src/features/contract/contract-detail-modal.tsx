import React from 'react';
import { Contract } from './contract-list';

interface ContractDetailModalProps {
  contract: Contract | null;
  onClose: () => void;
}

const ContractAvatar: React.FC<{ contract: Contract }> = ({ contract }) => {
  const text = contract.supplier ? contract.supplier[0].toUpperCase() : '?';
  return (
    <div className='bg-primary mr-3 flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white'>
      {text}
    </div>
  );
};

const ContractDetailModal: React.FC<ContractDetailModalProps> = ({
  contract,
  onClose
}) => {
  if (!contract) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='max-w-[90vw] min-w-[320px] rounded-lg bg-white p-6 shadow-lg'>
        <div className='mb-4 flex items-center'>
          <ContractAvatar contract={contract} />
          <div>
            <div className='text-lg font-bold'>
              Sözleşme No: {contract.contract_number}
            </div>
            <div className='text-sm text-gray-500'>
              Tedarikçi: {contract.supplier}
            </div>
          </div>
        </div>
        <div className='mb-2'>
          <b>Satın Alma Tarihi:</b> {contract.purchase_date}
        </div>
        <div className='mb-2'>
          <b>Tutar:</b> {contract.total_value} ₺
        </div>
        <div className='mb-2'>
          <b>Not:</b> {contract.notes || '-'}
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

export default ContractDetailModal;
