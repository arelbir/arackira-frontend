"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DraftDialogProps {
  /**
   * Dialog açık mı?
   */
  open: boolean;
  
  /**
   * Dialog açık/kapalı durumu değiştiğinde çağrılır
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * Draft kullanma kararı verildiğinde çağrılır
   * @param use - true: draft kullan, false: draft'ı sil ve kullanma
   */
  onDraftDecision: (use: boolean) => void;
}

/**
 * Draft bulunduğunda gösterilecek dialog bileşeni
 */
export const DraftDialog: React.FC<DraftDialogProps> = ({
  open,
  onOpenChange,
  onDraftDecision
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Taslak Bulundu</DialogTitle>
          <DialogDescription>
            Önceden kaydedilmiş bir taslak bulundu. Bu taslağı yüklemek ister misiniz?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onDraftDecision(false)}>
            Hayır
          </Button>
          <Button onClick={() => onDraftDecision(true)}>Evet, Taslağı Yükle</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DraftDialog;
