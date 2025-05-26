// Satır aksiyon menüsü (düzenle, sil)
'use client';
import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { VehicleStatus } from './vehicleStatusService';

interface VehicleStatusActionsMenuProps {
  vehicleStatus: VehicleStatus;
  onEdit: (vehicleStatus: VehicleStatus) => void;
  onDelete: (vehicleStatus: VehicleStatus) => void;
}

const VehicleStatusActionsMenu: React.FC<VehicleStatusActionsMenuProps> = ({ vehicleStatus, onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='hover:bg-muted rounded p-2'>
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onEdit(vehicleStatus)}>
          <Edit className='mr-2 h-4 w-4' /> Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(vehicleStatus)} className='text-destructive'>
          <Trash2 className='mr-2 h-4 w-4' /> Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VehicleStatusActionsMenu;
