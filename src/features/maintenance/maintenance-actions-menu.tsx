'use client';
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Copy } from 'lucide-react';
import { MaintenanceRecord } from './maintenance-list';

interface MaintenanceActionsMenuProps {
  record: MaintenanceRecord;
  onEdit?: (record: MaintenanceRecord) => void;
  onDelete?: (record: MaintenanceRecord) => void;
  onDetail?: (record: MaintenanceRecord) => void;
}

const MaintenanceActionsMenu: React.FC<MaintenanceActionsMenuProps> = ({
  record,
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
        <DropdownMenuItem onClick={() => onDetail?.(record)}>
          <Eye className='mr-2 h-4 w-4' /> Detay
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(record));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          <Copy className='mr-2 h-4 w-4' /> {copied ? 'Kopyalandı!' : 'Kopyala'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit?.(record)}>
          Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete?.(record)}
          className='text-destructive'
        >
          Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MaintenanceActionsMenu;
