'use client';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Copy } from 'lucide-react';

export interface Contract {
  id: number;
  contract_number: string;
  supplier: string;
  purchase_date: string;
  total_value: number;
  notes?: string;
}

interface ContractActionsMenuProps {
  contract: Contract;
  onEdit?: (contract: Contract) => void;
  onDelete?: (contract: Contract) => void;
  onDetail?: (contract: Contract) => void;
}

const ContractActionsMenu: React.FC<ContractActionsMenuProps> = ({
  contract,
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
        <DropdownMenuItem onClick={() => onDetail?.(contract)}>
          <Eye className='mr-2 h-4 w-4' /> Detay
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(contract));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          <Copy className='mr-2 h-4 w-4' /> {copied ? 'Kopyalandı!' : 'Kopyala'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit?.(contract)}>
          Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete?.(contract)}
          className='text-destructive'
        >
          Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContractActionsMenu;
