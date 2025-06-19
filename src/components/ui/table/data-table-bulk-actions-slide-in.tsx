'use client';

import React from 'react';
import { Table } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ActionButton } from './action-button';
import { useBulkActions } from '@/hooks/useBulkActions';
import { Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { Cross2Icon } from '@radix-ui/react-icons';

interface DataTableBulkActionsSlideInProps<TData> {
  table: Table<TData>;
  resourceUrl?: string;
  onAction?: () => void;
  editBasePath?: string;
  className?: string;
}

/**
 * Bulk actions için slide-in toolbar bileşeni
 * Fixed position kullanarak layout shift sorununu çözer
 */
export function DataTableBulkActionsSlideIn<TData>({
  table,
  resourceUrl = '',
  onAction,
  editBasePath,
  className,
}: DataTableBulkActionsSlideInProps<TData>) {
  const router = useRouter();
  
  // useBulkActions hook'u ile işlem mantığını soyutluyoruz
  const { isProcessing, handleBulkDelete, handleBulkRestore } = useBulkActions({ 
    resourceUrl, 
    onAction: () => {
      onAction?.();
      table.resetRowSelection(); // İşlem sonrası seçimleri temizle
    }
  });

  // Seçili satırları al ve tipini doğru şekilde belirt
  const selectedRowsData = table.getSelectedRowModel().rows;
  const selectedRows = selectedRowsData.map(row => row.original as { id: number | string, deleted_at?: string | null });
  
  // Seçili satırlar içinde silinmiş olanları ve aktif olanları hesapla
  const deletedCount = selectedRows.filter(row => row?.deleted_at).length;
  const activeCount = selectedRows.length - deletedCount;
  
  // Tek satır seçildiğinde düzenleme yapılabilir mi?
  const singleEditEnabled = selectedRows.length === 1 && editBasePath;
  
  // Tek satır düzenleme yönlendir
  const handleSingleEdit = () => {
    if (singleEditEnabled) {
      router.push(`${editBasePath}/${selectedRows[0].id}/edit`);
    }
  };
  
  // Satır seçimi var mı?
  const hasSelectedRows = selectedRowsData.length > 0;
  
  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 bg-primary/10 backdrop-blur-sm border-b px-4 py-2 transform transition-all duration-300 ease-in-out z-[100] shadow-lg",
        hasSelectedRows ? "translate-y-0" : "-translate-y-full",
        className
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {selectedRowsData.length} kayıt seçildi
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Düzenleme butonu - reusable ActionButton kullanıyor */}
          {singleEditEnabled && (
            <ActionButton 
              onClick={handleSingleEdit}
              variant="outline" 
              icon={<Pencil className="h-4 w-4" />}
            >
              Düzenle
            </ActionButton>
          )}
          
          {/* Geri alma butonu - reusable ActionButton kullanıyor */}
          {deletedCount > 0 && (
            <ActionButton 
              onClick={() => handleBulkRestore(selectedRows)}
              variant="outline" 
              icon={<RotateCcw className="h-4 w-4" />}
              isLoading={isProcessing}
            >
              {deletedCount} Kaydı Geri Al
            </ActionButton>
          )}
          
          {/* Silme butonu - reusable ActionButton kullanıyor */}
          {activeCount > 0 && (
            <ActionButton 
              onClick={() => handleBulkDelete(selectedRows)}
              variant="destructive" 
              icon={<Trash2 className="h-4 w-4" />}
              isLoading={isProcessing}
            >
              {activeCount} Kaydı Sil
            </ActionButton>
          )}
          
          {/* İptal butonu - reusable ActionButton kullanıyor */}
          <ActionButton 
            onClick={() => table.resetRowSelection()}
            variant="ghost" 
            icon={<Cross2Icon className="h-4 w-4" />}
          >
            İptal
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
