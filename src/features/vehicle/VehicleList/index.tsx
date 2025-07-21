'use client';

import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DialogTitle } from '@/components/ui/dialog';
import { VehicleImportExport } from './VehicleImportExport';
import { useVehicleTable } from '../hooks/useVehicleTable';
import { useVehicles } from '../hooks/useVehicles';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Edit, Eye, FilterX } from 'lucide-react';
import Link from 'next/link';


const VehicleList: React.FC = () => {
  const { vehicles, loading, error } = useVehicles();
  const { table, setColumnFilters } = useVehicleTable(vehicles);
  const router = useRouter();
  
  // Taslak filtresi durumunu izle
  const [showDraftsOnly, setShowDraftsOnly] = React.useState(false);
  
  // Tablo sütunları için özel render fonksiyonları
  React.useEffect(() => {
    // is_draft sütunu için özel hücre render
    const isDraftColumn = table.getColumn('is_draft');
    if (isDraftColumn) {
      isDraftColumn.columnDef.header = 'Taslak';
      isDraftColumn.columnDef.cell = ({ row }) => {
        const isDraft = row.original.is_draft;
        return (
          <div className="text-center">
            {isDraft ? 
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Taslak</span> : 
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Aktif</span>
            }
          </div>
        );
      };
    }
    
    // Actions sütunu için özel hücre render
    const actionsColumn = table.getColumn('actions');
    if (actionsColumn) {
      actionsColumn.columnDef.cell = ({ row }) => {
        const vehicle = row.original;
        return (
          <div className="flex items-center gap-2 justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild
                >
                  <Link href={`/dashboard/vehicles/edit/${vehicle.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Düzenle</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild
                >
                  <Link href={`/dashboard/vehicles/view/${vehicle.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Görüntüle</TooltipContent>
            </Tooltip>
          </div>
        );
      };
    }
  }, [table]);



  /* ---------------- render ---------------- */
  if (error) return <div className='p-8 text-red-500'>Error: {error instanceof Error ? error.message : String(error)}</div>;

  return (
    <div className='flex h-full w-full flex-col p-8'>
      <DataTableToolbar table={table} className="mb-3" storageKey="vehicles-table">
        <VehicleImportExportModal />
        <Button size="sm" onClick={() => router.push('/dashboard/vehicles/create')} className="mr-4">
          Araç Ekle
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              variant={showDraftsOnly ? "default" : "outline"}
              className="mr-2 flex gap-2 items-center" 
              onClick={() => {
                setShowDraftsOnly(!showDraftsOnly);
                if (!showDraftsOnly) {
                  // Taslak filtresi ekle
                  setColumnFilters([
                    {
                      id: 'is_draft',
                      value: true
                    }
                  ]);
                } else {
                  // Taslak filtresini kaldır
                  setColumnFilters([]);
                }
              }}
            >
              <FilterX className="h-4 w-4" />
              {showDraftsOnly ? "Tüm Araçları Göster" : "Taslakları Göster"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {showDraftsOnly ? "Tüm araçları göster" : "Sadece taslak araçları göster"}
          </TooltipContent>
        </Tooltip>               
      </DataTableToolbar>
      <div className='flex-1 min-h-0 flex flex-col overflow-auto mb-4'>
        {loading ? (
          <DataTableSkeleton columnCount={table.getAllColumns().length} rowCount={10} />
        ) : (
          <DataTable table={table} />
        )}
      </div>
    </div>
  );
};


function VehicleImportExportModal() {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="mr-2" onClick={() => setOpen(true)}>
          Toplu Araç Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogTitle>Araçları Toplu İçe Aktar / Dışa Aktar</DialogTitle>
        <VehicleImportExport />
      </DialogContent>
    </Dialog>
  );
}

export default VehicleList;