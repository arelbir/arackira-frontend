// Tedarikçiler Listeleme ve aksiyonlar
'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import { SupplierActionsMenu } from './supplier-actions-menu';
import type { Supplier } from './supplierService';
import { Badge } from '@/components/ui/badge';

interface SupplierListProps {
  suppliers: Supplier[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

const SupplierList: React.FC<SupplierListProps> = ({ suppliers, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filtered = suppliers.filter(i => {
    // Arama filtresi
    const matchesSearch = 
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      (i.contact_person?.toLowerCase().includes(search.toLowerCase())) ||
      (i.tax_number?.toLowerCase().includes(search.toLowerCase()));
    
    // Aktif/İnaktif filtresi
    const matchesActiveFilter = 
      activeFilter === 'all' ||
      (activeFilter === 'active' && i.is_active) ||
      (activeFilter === 'inactive' && !i.is_active);
    
    return matchesSearch && matchesActiveFilter;
  });

  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Tedarikçi ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Tedarikçi'
      >
        <div>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className='rounded-md border border-input px-3 py-2 text-sm'
          >
            <option value='all'>Tüm Tedarikçiler</option>
            <option value='active'>Aktif</option>
            <option value='inactive'>İnaktif</option>
          </select>
        </div>
      </DefinitionListToolbar>

      <div className='relative w-full overflow-x-auto'>
        <table className='w-full caption-bottom text-sm'>
          <thead>
            <tr className='bg-muted text-muted-foreground'>
              <th className='py-2 px-4 text-left'>Tedarikçi Adı</th>
              <th className='py-2 px-4 text-left'>İletişim</th>
              <th className='py-2 px-4 text-left'>Vergi No</th>
              <th className='py-2 px-4 text-left'>Durum</th>
              <th className='py-2 px-4 w-12'></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className='text-center py-4 text-muted'>Yükleniyor...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className='text-center py-4 text-muted'>Kayıt bulunamadı.</td></tr>
            ) : (
              filtered.map((supplier, idx) => (
                <tr key={supplier.id ?? `supplier-row-${idx}`} className='border-b'>
                  <td className='py-2 px-4'>{supplier.name}</td>
                  <td className='py-2 px-4'>
                    {supplier.contact_person ? supplier.contact_person : '-'}
                    {supplier.phone && <div className="text-xs text-muted-foreground">{supplier.phone}</div>}
                  </td>
                  <td className='py-2 px-4'>{supplier.tax_number || '-'}</td>
                  <td className='py-2 px-4'>
                    {supplier.is_active ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                        Aktif
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 hover:bg-gray-50 border-gray-200">
                        İnaktif
                      </Badge>
                    )}
                  </td>
                  <td className='py-2 px-4 text-right'>
                    <SupplierActionsMenu 
                      supplier={supplier} 
                      onEdit={onEdit} 
                      onDelete={onDelete} 
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierList;