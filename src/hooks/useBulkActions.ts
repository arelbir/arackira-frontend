'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useDeleteResource } from './useDeleteResource';
import { useRestoreResource } from './useRestoreResource';

interface BulkActionOptions {
  resourceUrl: string;
  onAction?: () => void;
}

interface BulkActionRow {
  id: number | string;
  deleted_at?: string | null;
  [key: string]: any;
}

/**
 * Toplu işlem mantığını soyutlayan hook
 * DRY prensibine uygun olarak benzer işlem kodlarını birleştirir
 */
export function useBulkActions({ resourceUrl, onAction }: BulkActionOptions) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { deleteResource } = useDeleteResource(resourceUrl);
  const { restoreResource } = useRestoreResource(resourceUrl);

  /**
   * Generic bulk action işleyici
   */
  const performBulkAction = async <T extends BulkActionRow[]>({
    rows,
    actionFn,
    filter,
    successMessage,
    errorMessage = 'İşlem başarısız oldu',
  }: {
    rows: T;
    actionFn: (id: string | number) => Promise<any>;
    filter: (row: BulkActionRow) => boolean;
    successMessage: string;
    errorMessage?: string;
  }) => {
    if (!rows.length || !resourceUrl) return;
    
    try {
      setIsProcessing(true);
      const filteredRows = rows.filter(filter);
      
      if (!filteredRows.length) return;
      
      const promises = filteredRows.map(row => actionFn(row.id));
      
      await Promise.all(promises);
      toast.success(successMessage);
      onAction?.();
      return true;
    } catch (err: any) {
      toast.error(err?.message || errorMessage);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Toplu silme işlemi
   */
  const handleBulkDelete = async <T extends BulkActionRow[]>(rows: T) => {
    return performBulkAction({
      rows,
      actionFn: deleteResource,
      filter: row => !row.deleted_at,
      successMessage: `${rows.filter(row => !row.deleted_at).length} kayıt silindi`,
    });
  };

  /**
   * Toplu geri alma işlemi
   */
  const handleBulkRestore = async <T extends BulkActionRow[]>(rows: T) => {
    return performBulkAction({
      rows,
      actionFn: restoreResource,
      filter: row => Boolean(row.deleted_at),
      successMessage: `${rows.filter(row => Boolean(row.deleted_at)).length} kayıt geri alındı`,
    });
  };

  return {
    isProcessing,
    handleBulkDelete,
    handleBulkRestore,
  };
}
