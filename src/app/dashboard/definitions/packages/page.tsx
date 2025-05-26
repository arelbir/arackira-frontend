'use client';
import React, { useState } from 'react';
import DefinitionListToolbar from '@/features/definitions/DefinitionListToolbar';
import { PackageList } from '@/features/definitions/packages/package-list';
import { usePackagesByModel } from '@/features/definitions/packages/usePackagesByModel';
import { createPackage, updatePackage } from '@/features/definitions/packages/packageService';
import { PackageForm } from '@/features/definitions/packages/package-form';
import { PackageFormValues } from '@/features/definitions/packages/package-schema';
import { useBrand, useModelsByBrand } from '@/features/definitions/hooks';

export default function PackagesPage() {
  const { brands, loading: loadingBrands } = useBrand();
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [editing, setEditing] = useState<PackageFormValues | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { models, loading: loadingModels } = useModelsByBrand(selectedBrandId);

  const [search, setSearch] = useState('');

  // Filtrelenmiş paketleri almak için PackageList'e search prop'u eklenebilir
  // Eğer backend arama desteklemiyorsa, frontend'de filtreleme yapılabilir

  const [reloadKey, setReloadKey] = useState(0);
  const { packages, loading: loadingPackages, error } = usePackagesByModel(selectedModelId);

  return (
    <div className="bg-background rounded shadow p-4 border border-border">
      <h1 className="text-xl font-bold mb-4">Araç Paketleri</h1>
      <DefinitionListToolbar
        searchPlaceholder="Paket ara..."
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={() => { setEditing(null); setShowForm(true); }}
        addLabel="Yeni Paket"
        className="mb-4"
      >
        <select
          className="border border-input bg-background text-foreground rounded px-2 py-1 w-full md:w-1/4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 outline-none transition-colors"
          value={selectedBrandId || ''}
          onChange={e => {
            setSelectedBrandId(e.target.value ? Number(e.target.value) : null);
            setSelectedModelId(null);
          }}
          disabled={loadingBrands}
        >
          <option value="">Tüm Markalar</option>
          {brands.map((b: { id: number; name: string }) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select
          className="border border-input bg-background text-foreground rounded px-2 py-1 w-full md:w-1/4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 outline-none transition-colors"
          value={selectedModelId || ''}
          onChange={e => setSelectedModelId(e.target.value ? Number(e.target.value) : null)}
          disabled={!selectedBrandId || loadingModels}
        >
          <option value="">Tüm Modeller</option>
          {models.map((m: { id: number; name: string }) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </DefinitionListToolbar>
      {showForm && (
        <PackageForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSubmit={async (values) => {
            if (values.id) {
              await updatePackage(values.id, values);
            } else {
              await createPackage(values);
            }
            setShowForm(false);
            setEditing(null);
            setReloadKey(k => k + 1); // Paketi güncelle
          }}
          initialData={editing || { model_id: selectedModelId || 0, name: '', description: '' }}
          brandId={selectedBrandId}
          loading={false}
        />
      )}
      <PackageList
        packages={packages}
        loading={loadingPackages}
        onEdit={pkg => { setEditing(pkg); setShowForm(true); }}
        onDelete={async (id: number) => {
          if (!window.confirm('Bu paketi silmek istediğinize emin misiniz?')) return;
          const { deletePackage } = await import('@/features/definitions/packages/packageService');
          await deletePackage(id);
          setReloadKey(k => k + 1);
        }}
      />
    </div>
  );
}
