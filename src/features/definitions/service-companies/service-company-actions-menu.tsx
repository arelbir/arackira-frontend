// Satır aksiyon menüsü (düzenle, sil)
'use client';
import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { ServiceCompany } from './serviceCompanyService';

interface ServiceCompanyActionsMenuProps {
  serviceCompany: ServiceCompany;
  onEdit: (serviceCompany: ServiceCompany) => void;
  onDelete: (serviceCompany: ServiceCompany) => void;
}

const ServiceCompanyActionsMenu: React.FC<ServiceCompanyActionsMenuProps> = ({ serviceCompany, onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='hover:bg-muted rounded p-2'>
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onEdit(serviceCompany)}>
          <Edit className='mr-2 h-4 w-4' /> Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(serviceCompany)} className='text-destructive'>
          <Trash2 className='mr-2 h-4 w-4' /> Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServiceCompanyActionsMenu;
