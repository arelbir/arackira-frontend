'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Insurance } from '../types';

interface InsuranceDeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToDelete: Insurance | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Sigorta silme onayı dialog bileşeni
 */
export function InsuranceDeleteConfirmDialog({
  open,
  onOpenChange,
  itemToDelete,
  isDeleting,
  onConfirm,
  onCancel,
}: InsuranceDeleteConfirmDialogProps) {
  // Tarih formatını daha okunabilir hale getirme
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR');
    } catch (e) {
      return dateString;
    }
  };

  // Sigorta öğesi için tanımlayıcı etiket oluştur
  const getItemLabel = () => {
    if (!itemToDelete) return '';
    
    const insuranceTypeName = itemToDelete.insurance_type?.name || '';
    const startDate = formatDate(itemToDelete.start_date);
    
    return `${insuranceTypeName} (${startDate})`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sigorta Silme Onayı</DialogTitle>
          <DialogDescription>
            <span className="text-destructive font-semibold">{getItemLabel()}</span> sigorta kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
            İptal
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Siliniyor...' : 'Sil'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
