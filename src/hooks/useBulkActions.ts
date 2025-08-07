'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface BulkActionOptions<T extends BulkActionRow[]> {
  onAction?: () => void;
  deleteAction: (ids: (string | number)[]) => Promise<any>;
  restoreAction: (ids: (string | number)[]) => Promise<any>;
}

interface BulkActionRow {
  id: number | string;
  deleted_at?: string | null;
  [key: string]: any;
}

/**
 * Toplu işlem mantığını soyutlayan hook.
 * API çağrılarını soyutlayarak, işlemleri gerçekleştirecek fonksiyonları parametre olarak alır.
 */
export function useBulkActions<T extends BulkActionRow[]>({ 
  onAction,
  deleteAction,
  restoreAction
}: BulkActionOptions<T>) {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Generic bulk action işleyici
   */
  const performBulkAction = async ({
    rows,
    actionFn,
    filter,
    successMessage,
    errorMessage = 'İşlem başarısız oldu',
  }: {
    rows: T;
    actionFn: (ids: (string | number)[]) => Promise<any>;
    filter: (row: BulkActionRow) => boolean;
    successMessage: string;
    errorMessage?: string;
  }) => {
    if (!rows.length) return;
    
    try {
      setIsProcessing(true);
      const filteredRows = rows.filter(filter);
      
      if (!filteredRows.length) return;
      
      const ids = filteredRows.map(row => row.id);
      
      await actionFn(ids);

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
  const handleBulkDelete = async (rows: T) => {
    return performBulkAction({
      rows,
      actionFn: deleteAction,
      filter: row => !row.deleted_at,
      successMessage: `${rows.filter(row => !row.deleted_at).length} kayıt silindi`,
    });
  };

  /**
   * Toplu geri alma işlemi
   */
  const handleBulkRestore = async (rows: T) => {
    return performBulkAction({
      rows,
      actionFn: restoreAction,
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


