import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Copy } from 'lucide-react';
import { Customer } from './customer-list';

interface CustomerActionsMenuProps {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  onDetail?: (customer: Customer) => void;
}

const CustomerActionsMenu: React.FC<CustomerActionsMenuProps> = ({
  customer,
  onEdit,
  onDelete,
  onDetail
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='hover:bg-muted rounded p-2'>
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onDetail?.(customer)}>
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
        <DropdownMenuItem onClick={() => onEdit?.(customer)}>
          Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete?.(customer)}
          className='text-destructive'
        >
          Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomerActionsMenu;
