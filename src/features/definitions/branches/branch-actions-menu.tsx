// Şube için aksiyon menüsü (düzenle/sil)
'use client';
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import type { Branch } from './useBranch';

interface BranchActionsMenuProps {
  branch: Branch;
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
}

const BranchActionsMenu: React.FC<BranchActionsMenuProps> = ({ branch, onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='p-1 rounded hover:bg-muted'>
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => onEdit(branch)}>
          Düzenle
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(branch)} className='text-red-600'>
          Sil
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BranchActionsMenu;
