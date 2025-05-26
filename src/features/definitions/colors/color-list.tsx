// Renkleri listeleyen ana tablo ve aksiyonlar
'use client';
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import DefinitionListToolbar from '../DefinitionListToolbar';
import { Plus, MoreVertical } from 'lucide-react';
import ColorForm from './color-form';
import ColorActionsMenu from './color-actions-menu';
import type { Color } from './useColor';

interface ColorListProps {
  onEdit: (color: Color) => void;
  onDelete: (color: Color) => void;
  onAdd: () => void;
  colors: Color[];
  loading: boolean;
}

const ColorList: React.FC<ColorListProps> = ({ onEdit, onDelete, onAdd, colors, loading }) => {
  const [search, setSearch] = useState('');
  const filtered = colors.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Renk ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Renk'
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ad</TableHead>
            <TableHead>Açıklama</TableHead>
            <TableHead className='w-12'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3}>Yükleniyor...</TableCell>
            </TableRow>
          ) : filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3}>Kayıt bulunamadı.</TableCell>
            </TableRow>
          ) : (
            filtered.map((color: Color) => (
              <TableRow key={color.id}>
                <TableCell>{color.name}</TableCell>
                <TableCell>{color.description || '-'}</TableCell>
                <TableCell>
                  <ColorActionsMenu color={color} onEdit={(color: Color) => onEdit(color)} onDelete={(color: Color) => onDelete(color)} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ColorList;
