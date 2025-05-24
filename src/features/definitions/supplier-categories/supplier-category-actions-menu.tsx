// Satır aksiyon menüsü (düzenle, sil)
'use client';
import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { SupplierCategory } from './supplierCategoryService';

interface SupplierCategoryActionsMenuProps {
  supplierCategory: SupplierCategory;
  onEdit: (supplierCategory: SupplierCategory) => void;
  onDelete: (supplierCategory: SupplierCategory) => void;
}

const SupplierCategoryActionsMenu: React.FC<SupplierCategoryActionsMenuProps> = ({ supplierCategory, onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='hover:bg-muted rounded p-2'>
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onEdit(supplierCategory)}>
          <Edit className='mr-2 h-4 w-4' /> Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(supplierCategory)} className='text-destructive'>
          <Trash2 className='mr-2 h-4 w-4' /> Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SupplierCategoryActionsMenu;
