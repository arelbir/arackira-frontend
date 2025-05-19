import React from 'react';
import { Eye, Copy } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Customer } from './customer-list';

interface CustomerCopyDetailMenuProps {
  customer: Customer;
  onDetail: (customer: Customer) => void;
  copied: boolean;
  setCopied: (value: boolean) => void;
}

const CustomerCopyDetailMenu: React.FC<CustomerCopyDetailMenuProps> = ({
  customer,
  onDetail,
  copied,
  setCopied
}) => {
  return (
    <>
      <DropdownMenuItem onClick={() => onDetail(customer)}>
        <Eye className='mr-2 h-4 w-4' /> Detay
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(customer));
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        <Copy className='mr-2 h-4 w-4' /> {copied ? 'Kopyalandı!' : 'Kopyala'}
      </DropdownMenuItem>
    </>
  );
};

export default CustomerCopyDetailMenu;
