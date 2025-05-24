// Satır aksiyon menüsü (düzenle, sil)
'use client';
import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { InsuranceCompany } from './insuranceCompanyService';

interface InsuranceCompanyActionsMenuProps {
  insuranceCompany: InsuranceCompany;
  onEdit: (insuranceCompany: InsuranceCompany) => void;
  onDelete: (insuranceCompany: InsuranceCompany) => void;
}

const InsuranceCompanyActionsMenu: React.FC<InsuranceCompanyActionsMenuProps> = ({ insuranceCompany, onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='hover:bg-muted rounded p-2'>
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onEdit(insuranceCompany)}>
          <Edit className='mr-2 h-4 w-4' /> Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(insuranceCompany)} className='text-destructive'>
          <Trash2 className='mr-2 h-4 w-4' /> Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InsuranceCompanyActionsMenu;
