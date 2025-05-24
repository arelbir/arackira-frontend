import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, Copy } from 'lucide-react';

export interface Vehicle {
  id: number;
  plate_number: string;
  brand: string;
  year: number;
  current_status: string;
  [key: string]: any;
}

interface VehicleActionsMenuProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  onDetail?: (vehicle: Vehicle) => void;
}

const VehicleActionsMenu: React.FC<VehicleActionsMenuProps> = ({
  vehicle,
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
        <DropdownMenuItem onClick={() => onDetail?.(vehicle)}>
          <Eye className='mr-2 h-4 w-4' /> Detay
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(vehicle));
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          <Copy className='mr-2 h-4 w-4' /> {copied ? 'Kopyalandı!' : 'Kopyala'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit?.(vehicle)}>
          Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete?.(vehicle)}
          className='text-destructive'
        >
          Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VehicleActionsMenu;
