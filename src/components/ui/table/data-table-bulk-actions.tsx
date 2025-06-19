import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDeleteResource } from "@/hooks/useDeleteResource";
import { useRestoreResource } from "@/hooks/useRestoreResource";
import { Trash2, RotateCcw, Loader2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTableConfirmDialog } from "./data-table-confirm-dialog";
import { AnimatePresence, motion } from "framer-motion";

interface DataTableBulkActionsProps<T extends { id: number; deleted_at?: string | null }> {
  selectedRows: T[];
  resourceUrl: string;
  onAction?: () => void;
  editBasePath?: string;
  className?: string;
}

export function DataTableBulkActions<T extends { id: number; deleted_at?: string | null }>({
  selectedRows,
  resourceUrl,
  onAction,
  editBasePath,
  className,
}: DataTableBulkActionsProps<T>) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const router = useRouter();
  const { deleteResource } = useDeleteResource(resourceUrl);
  const { restoreResource } = useRestoreResource(resourceUrl);
  
  // Seçili kayıtlar arasında silinmiş olanların sayısı
  const deletedCount = selectedRows.filter(row => row.deleted_at).length;
  // Seçili kayıtlar arasında silinmemiş olanların sayısı
  const activeCount = selectedRows.length - deletedCount;

  // Bir kayıt varsa ve düzenleme yolağı belirtilmişse düzenleme etkin
  const singleEditEnabled = selectedRows.length === 1 && editBasePath;

  // Toplu silme işlemi
  const handleBulkDelete = async () => {
    if (!activeCount) return;
    
    try {
      setIsProcessing(true);
      const promises = selectedRows
        .filter(row => !row.deleted_at)
        .map(row => deleteResource(row.id));
      
      await Promise.all(promises);
      toast.success(`${activeCount} kayıt silindi`);
      onAction?.();
    } catch (err: any) {
      toast.error(err?.message || "Silme işlemi başarısız");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Silme işlemi onay diyalogunu göster
  const openDeleteConfirm = () => {
    setConfirmDelete(true);
  };

  // Toplu geri alma işlemi
  const handleBulkRestore = async () => {
    if (!deletedCount) return;
    
    try {
      setIsProcessing(true);
      const promises = selectedRows
        .filter(row => row.deleted_at)
        .map(row => restoreResource(row.id));
      
      await Promise.all(promises);
      toast.success(`${deletedCount} kayıt geri alındı`);
      onAction?.();
    } catch (err: any) {
      toast.error(err?.message || "Geri alma işlemi başarısız");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Geri alma işlemi onay diyalogunu göster
  const openRestoreConfirm = () => {
    setConfirmRestore(true);
  };

  // Tek kayıt düzenleme
  const handleSingleEdit = () => {
    if (selectedRows.length === 1 && editBasePath) {
      router.push(`${editBasePath}/${selectedRows[0].id}/edit`);
    }
  };

  // Hiçbir kayıt seçilmemişse çubuk gösterilmez
  if (selectedRows.length === 0) return null;

  return (
    <>
      {/* Onay Diyalogları */}
      <DataTableConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={handleBulkDelete}
        title="Kayıtları Sil"
        description={`${activeCount} kaydı silmek istediğinizden emin misiniz? Bu işlem geri alınabilir.`}
        actionLabel="Sil"
        variant="destructive"
        isProcessing={isProcessing}
      />
      
      <DataTableConfirmDialog
        open={confirmRestore}
        onOpenChange={setConfirmRestore}
        onConfirm={handleBulkRestore}
        title="Kayıtları Geri Al"
        description={`${deletedCount} kaydı geri almak istediğinizden emin misiniz?`}
        actionLabel="Geri Al"
        variant="outline"
        isProcessing={isProcessing}
      />
      
      {/* Animasyonlu Bulk Actions Toolbar */}
      <AnimatePresence>
        {selectedRows.length > 0 && (
          <motion.div
            className={cn("flex items-center gap-2 p-2 bg-muted/50 rounded-md mb-4", className)}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-sm font-medium text-muted-foreground mr-auto">
              {selectedRows.length} kayıt seçildi
            </span>
            
            {singleEditEnabled && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleSingleEdit}
                disabled={isProcessing}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Düzenle</span>
              </Button>
            )}

            {activeCount > 0 && (
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={openDeleteConfirm} 
                disabled={isProcessing}>
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                <span>{activeCount} kayıt sil</span>
              </Button>
            )}

            {deletedCount > 0 && (
              <Button 
                size="sm" 
                onClick={openRestoreConfirm} 
                disabled={isProcessing} 
                className="text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="mr-2 h-4 w-4" />
                )}
                <span>{deletedCount} kayıt geri al</span>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
