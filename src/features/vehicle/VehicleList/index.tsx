'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '@/hooks/use-debounce';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { useVehicleTable } from './useVehicleTable';
import { useVehicle } from '../hooks/useVehicle';
import { Vehicle } from '../vehicleService';
import VehicleDetailModal from './VehicleDetailModal';
import ProtectedRoute from '@/components/ProtectedRoute';
import { VehicleImportExport } from '../VehicleImportExport';
import { useBrand, useModel, useColor, useBranch, useVehicleStatuses } from '@/features/definitions/hooks';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useModel } from '@/features/definitions/hooks';
// import { useColor } from '@/features/definitions/hooks';
// import { useBranch } from '@/features/definitions/hooks';
// import { useVehicleStatuses } from '../form/useVehicleStatuses';


const VehicleList: React.FC = () => {
  // Tüm veri kaynaklarını yükle
  const { vehicles, loading: vehiclesLoading, error, removeVehicle } = useVehicle();
  const { brands, loading: brandsLoading } = useBrand();
  const { models, loading: modelsLoading } = useModel();
  const { colors, loading: colorsLoading } = useColor();
  const { branches, loading: branchesLoading } = useBranch();
  const { vehicleStatuses: statuses, loading: statusesLoading } = useVehicleStatuses();
  // console.log('brands:', brands);
  // console.log('models:', models);
  // console.log('colors:', colors);
  // console.log('branches:', branches);
  // console.log('statuses:', statuses);




  const [detailVehicle, setDetailVehicle] = useState<Vehicle | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [statusFilter, setStatusFilter] = useState<'all' | number>('all');
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('list');

  // İsim eşleştirme yardımcıları
  const getBrandName = useCallback((id?: number | null) => {
    return brands.find(b => b.id === id)?.name || '-';
  }, [brands]);
  const getModelName = useCallback((id?: number | null) => {
    return models.find((m: { id: number; name: string }) => m.id === id)?.name || '-';
  }, [models]);
  
  const getColorName = useCallback((id?: number | null) => {
    return colors.find((c: { id: number; name: string }) => c.id === id)?.name || '-';
  }, [colors]);
  
  const getBranchName = useCallback((id?: number | null) => {
    return branches.find((b: { id: number; name: string }) => b.id === id)?.name || '-';
  }, [branches]);
  
  const getStatusName = useCallback((id?: number | null) => {
    return statuses.find((s: { id: number; name: string }) => s.id === id)?.name || '-';
  }, [statuses]);

  // Arama ve filtreleme
  // Silme işlemi
  // Dummy delete handler for isolation
  const handleDelete = useCallback(async (v: Vehicle) => {
    if (!v.id) return;
    setLoadingId(v.id);
    await new Promise(res => setTimeout(res, 500)); // simulate async delay
    setLoadingId(null);
  }, []);

  // Detay ve edit fonksiyonlarını callback olarak tanımla
  const handleDetail = useCallback((v: Vehicle) => {
    setDetailVehicle(v);
  }, []);

  const handleEdit = useCallback((veh: Vehicle) => {
    setDetailVehicle(veh);
  }, []);

  const handleEditRedirect = useCallback((veh: Vehicle) => {
    window.location.href = `/dashboard/vehicles/edit/${veh.id}`;
  }, []);

  // Table instance: call useVehicleTable directly at the top level (React hook rules)
  const table = useVehicleTable({
    vehicles,
    onDetail: handleDetail,
    onEdit: handleEditRedirect,
    onDelete: handleDelete,
    getBrandName,
    getModelName,
    getBranchName,
    getColorName,
    getStatusName,
    loadingId,
    debouncedSearch,
    statusFilter,
  });

  // Render içeriğini stabilize etmek için useMemo kullan
  const renderedContent = useMemo(() => (
    <ProtectedRoute>
      <div className="h-full w-full flex-1 min-h-0 flex flex-col">
        <Tabs
          defaultValue="list"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full flex flex-col"
        >
          <div className="flex items-center justify-between px-8 pt-8 pb-4">
            <TabsList>
              <TabsTrigger value="list">Araç Listesi</TabsTrigger>
              <TabsTrigger value="import">Toplu Veri Aktarımı</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              {activeTab === 'list' && (
                <Button
                  variant="default"
                  onClick={() => (window.location.href = '/dashboard/vehicles/create')}
                >
                  Yeni Araç
                </Button>
              )}
            </div>
          </div>
          
          <TabsContent value="list" className="flex-1 flex flex-col overflow-auto h-full">
            <div className="flex items-center gap-4 px-8 pb-4">
              <input
                type="text"
                placeholder="Ara: plaka, marka, model, şube, renk..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-muted text-foreground border-border focus:ring-primary w-full max-w-xs rounded border px-4 py-2 focus:ring-2 focus:outline-none"
              />
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`bg-muted rounded px-4 py-1.5 text-sm font-medium ${statusFilter === 'all' ? 'text-primary' : 'text-foreground'} hover:bg-muted/70 whitespace-nowrap`}
                >
                  Tümü
                </button>
                {statuses.map((s: { id: number; name: string }) => (
                  <button
                    key={s.id}
                    onClick={() => setStatusFilter(s.id)}
                    className={`bg-muted rounded px-4 py-1.5 text-sm font-medium ${statusFilter === s.id ? 'text-primary' : 'text-foreground'} hover:bg-muted/70 whitespace-nowrap`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 min-h-0 flex flex-col overflow-auto px-8 pb-8">
              {(vehiclesLoading || brandsLoading || modelsLoading || colorsLoading || branchesLoading || statusesLoading) ? (
                <DataTableSkeleton columnCount={7} rowCount={8} />
              ) : (
                <DataTable table={table} />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="px-8 pb-8">
            <VehicleImportExport />
          </TabsContent>
        </Tabs>
        
        {detailVehicle && (
          <VehicleDetailModal
            vehicle={detailVehicle}
            onClose={() => setDetailVehicle(null)}
          />
        )}
      </div>
    </ProtectedRoute>
  ), [vehicles, debouncedSearch, statusFilter, detailVehicle, vehiclesLoading, brandsLoading, modelsLoading, colorsLoading, branchesLoading, statusesLoading, loadingId, activeTab]);
  
  return renderedContent;
};

export default VehicleList;
