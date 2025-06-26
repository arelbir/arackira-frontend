// Ortak Tanım Listesi Toolbar Componenti
'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DefinitionListToolbarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  addLabel?: string;
  className?: string;
  children?: React.ReactNode; // Ekstra filtre/select vs. için
}

const DefinitionListToolbar: React.FC<DefinitionListToolbarProps> = ({
  searchPlaceholder = '',
  searchValue,
  onSearchChange,
  onAdd,
  addLabel = 'Yeni Ekle',
  className = '',
  children
}) => {
  return (
    <div className={`flex flex-col md:flex-row gap-2 mb-4 ${className}`}>
      <Input
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
        className='w-full md:w-1/3'
      />
      {children}
      <Button
        className='ml-auto flex items-center'
        onClick={onAdd}
      >
        <Plus className='mr-2 h-4 w-4' /> {addLabel}
      </Button>
    </div>
  );
};

export default DefinitionListToolbar;
