import React, { useEffect, useState } from 'react';
import { getPackagesByModel, deletePackage, VehiclePackage } from './packageService';
import { PackageActionsMenu } from './package-actions-menu';

interface PackageListProps {
  packages: VehiclePackage[];
  loading: boolean;
  onEdit: (pkg: VehiclePackage) => void;
  onDelete: (id: number) => void;
}

export function PackageList({ packages, loading, onEdit, onDelete }: PackageListProps) {
  if (loading) return <div className="p-4 text-muted-foreground">Yükleniyor...</div>;
  if (!packages || packages.length === 0) return <div className="p-4 text-muted-foreground">Hiç paket bulunamadı.</div>;

  // handleDelete üst componente taşınacak, şimdilik kaldırıldı

  return (
    <div className="bg-background rounded shadow p-4 border border-border">
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="py-2 px-2 text-left">Paket Adı</th>
              <th className="py-2 px-2 text-left">Açıklama</th>
              <th className="py-2 px-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(pkg => (
              <tr key={pkg.id}>
                <td className="py-2 px-2">{pkg.name}</td>
                <td className="py-2 px-2">{pkg.description}</td>
                <td className="py-2 px-2">
                  <PackageActionsMenu pkg={pkg} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
