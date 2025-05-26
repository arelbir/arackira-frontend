// Araç satır aksiyon menüsü (detay, düzenle, sil)
'use client';
import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Info } from 'lucide-react';
import type { Vehicle } from '../vehicleService';

interface VehicleActionsMenuProps {
  vehicle: Vehicle;
  onDetail: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  deleting?: boolean;
}

const VehicleActionsMenu: React.FC<VehicleActionsMenuProps> = ({ vehicle, onDetail, onEdit, onDelete, deleting }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='hover:bg-muted rounded p-2'>
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onDetail(vehicle)}>
          <Info className='mr-2 h-4 w-4' /> Detay
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(vehicle)}>
          <Edit className='mr-2 h-4 w-4' /> Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(vehicle)} className='text-destructive' disabled={deleting}>
          <Trash2 className='mr-2 h-4 w-4' />{deleting ? 'Siliniyor...' : 'Sil'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VehicleActionsMenu;
