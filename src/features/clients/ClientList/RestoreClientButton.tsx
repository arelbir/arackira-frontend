"use client";
import { Button } from "@/components/ui/button";
import { useRestoreClient } from "../hooks/useRestoreClient";
import { toast } from "sonner";

interface RestoreClientButtonProps {
  clientId: number;
  onRestored?: () => void;
}

export function RestoreClientButton({ clientId, onRestored }: RestoreClientButtonProps) {
  const { restoreClient, isRestoring } = useRestoreClient();

  const handleRestore = async () => {
    try {
      await restoreClient(clientId);
      toast.success("Müşteri kaydı geri alındı");
      onRestored?.();
    } catch (err: any) {
      toast.error(err?.message || "Geri alma başarısız oldu");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleRestore} disabled={isRestoring}>
      Geri Al
    </Button>
  );
}
