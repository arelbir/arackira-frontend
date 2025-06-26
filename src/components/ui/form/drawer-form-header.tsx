'use client';

import { Button } from "@/components/ui/button";
import { DrawerTitle } from "@/components/ui/drawer";

interface DrawerFormHeaderProps {
  title: string;
  onSave: () => void;
  onCancel: () => void;
  saveButtonLabel?: string;
  cancelButtonLabel?: string;
  isLoading?: boolean;
  saveDisabled?: boolean;
}

/**
 * Tüm açılır formlar için ortak kullanabileceğimiz standart header bileşeni.
 * Başlık ve butonları içerir.
 */
export function DrawerFormHeader({
  title,
  onSave,
  onCancel,
  saveButtonLabel = "Kaydet",
  cancelButtonLabel = "İptal",
  isLoading = false,
  saveDisabled = false
}: DrawerFormHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <DrawerTitle>{title}</DrawerTitle>
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelButtonLabel}
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={isLoading || saveDisabled}
        >
          {saveButtonLabel}
        </Button>
      </div>
    </div>
  );
}
