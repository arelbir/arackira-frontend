/**
 * Draft yönetimi için custom hook
 */
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { DRAFT_KEY } from "../utils/storage-constants";
import { VehicleCreateValues } from "../../vehicle/create/create-tabs/schema";

interface UseDraftManagementProps {
  form: UseFormReturn<VehicleCreateValues>;
  editMode: boolean;
}

interface UseDraftManagementResult {
  draft: Partial<VehicleCreateValues> | null;
  showDraftDialog: boolean;
  setShowDraftDialog: (show: boolean) => void;
  useDraft: boolean | null;
  setUseDraft: (use: boolean | null) => void;
  saveDraft: (formData: Partial<VehicleCreateValues>) => void;
  clearDraft: () => void;
}

/**
 * Draft verilerinin yönetimi için custom hook
 * @param props - Draft yönetimi için gerekli parametreler
 * @returns Draft yönetimi için state ve fonksiyonlar
 */
export const useDraftManagement = ({
  form,
  editMode
}: UseDraftManagementProps): UseDraftManagementResult => {
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<Partial<VehicleCreateValues> | null>(null);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [useDraft, setUseDraft] = useState<boolean | null>(null);

  // İlk yüklenme ve draft kontrolü
  useEffect(() => {
    setMounted(true);
    
    // Düzenleme modunda draft kullanılmaz
    if (editMode) return;
    
    // Taslağı local storage'dan al
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setDraft(parsedDraft);
        setShowDraftDialog(true);
      } catch (err) {
        console.error("Draft parsing error:", err);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [editMode]);

  // Draft kullanma kararı verilirse
  useEffect(() => {
    if (useDraft === true && draft) {
      form.reset(draft);
    } else if (useDraft === false) {
      clearDraft();
    }
  }, [useDraft, draft, form]);

  /**
   * Formun mevcut durumunu draft olarak kaydet
   * @param formData - Form verileri
   */
  const saveDraft = (formData: Partial<VehicleCreateValues>) => {
    if (!editMode) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  };

  /**
   * Draft verisini temizle
   */
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraft(null);
  };

  return {
    draft,
    showDraftDialog,
    setShowDraftDialog,
    useDraft,
    setUseDraft,
    saveDraft,
    clearDraft
  };
};
