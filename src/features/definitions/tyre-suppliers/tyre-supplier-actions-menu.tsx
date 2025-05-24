// Satır aksiyon menüsü (düzenle, sil)
'use client';
import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { TyreSupplier } from './tyreSupplierService';

interface TyreSupplierActionsMenuProps {
  tyreSupplier: TyreSupplier;
  onEdit: (tyreSupplier: TyreSupplier) => void;
  onDelete: (tyreSupplier: TyreSupplier) => void;
}

const TyreSupplierActionsMenu: React.FC<TyreSupplierActionsMenuProps> = ({ tyreSupplier, onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='hover:bg-muted rounded p-2'>
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onEdit(tyreSupplier)}>
          <Edit className='mr-2 h-4 w-4' /> Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(tyreSupplier)} className='text-destructive'>
          <Trash2 className='mr-2 h-4 w-4' /> Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TyreSupplierActionsMenu;
