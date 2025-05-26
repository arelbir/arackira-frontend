import React from 'react';
import { Plus } from 'lucide-react';
import DefinitionListToolbar from '../DefinitionListToolbar';
import BrandActionsMenu from './brand-actions-menu';
import type { Brand } from './brandService';

interface BrandListProps {
  brands: Brand[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

const BrandList: React.FC<BrandListProps> = ({ brands, loading, onAdd, onEdit, onDelete }) => {
  const [search, setSearch] = React.useState('');
  const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className='w-full'>
      <DefinitionListToolbar
        searchPlaceholder='Marka ara...'
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={onAdd}
        addLabel='Yeni Marka'
      />
      <div className='relative w-full overflow-x-auto'>
        <table className='w-full caption-bottom text-sm'>
          <thead>
            <tr className='border-b'>
              <th className='text-left py-2 px-4'>Ad</th>
              <th className='text-left py-2 px-4'>Açıklama</th>
              <th className='text-right py-2 px-4'></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className='text-center py-8'>Yükleniyor...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={3} className='text-center py-8'>Kayıt bulunamadı.</td></tr>
            ) : (
              filtered.map(brand => (
                <tr key={brand.id} className='border-b'>
                  <td className='py-2 px-4'>{brand.name}</td>
                  <td className='py-2 px-4'>{brand.description}</td>
                  <td className='py-2 px-4 text-right'>
                    <BrandActionsMenu brand={brand} onEdit={onEdit} onDelete={onDelete} />
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

export default BrandList;
