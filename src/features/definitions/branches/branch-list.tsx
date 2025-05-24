// Şubeleri listeleyen ana tablo ve aksiyonlar
'use client';
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import DefinitionListToolbar from '../DefinitionListToolbar';
import { Plus } from 'lucide-react';
import BranchForm from './branch-form';
import BranchActionsMenu from './branch-actions-menu';
import type { Branch } from './useBranch';

interface BranchListProps {
  onEdit: (branch: Branch) => void;
  onDelete: (branch: Branch) => void;
  onAdd: () => void;
  branches: Branch[];
  loading: boolean;
}

const BranchList: React.FC<BranchListProps> = ({ onEdit, onDelete, onAdd, branches, loading }) => {
  const [search, setSearch] = useState('');
  const filtered = branches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.address && b.address.toLowerCase().includes(search.toLowerCase())) ||
    (b.phone && b.phone.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Şube ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Şube'
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ad</TableHead>
            <TableHead>Adres</TableHead>
            <TableHead>Telefon</TableHead>
            <TableHead className='w-12'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4}>Yükleniyor...</TableCell>
            </TableRow>
          ) : filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>Kayıt bulunamadı.</TableCell>
            </TableRow>
          ) : (
            filtered.map((branch: Branch) => (
              <TableRow key={branch.id}>
                <TableCell>{branch.name}</TableCell>
                <TableCell>{branch.address || '-'}</TableCell>
                <TableCell>{branch.phone || '-'}</TableCell>
                <TableCell>
                  <BranchActionsMenu branch={branch} onEdit={() => onEdit(branch)} onDelete={() => onDelete(branch)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BranchList;
