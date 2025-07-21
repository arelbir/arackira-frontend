/**
 * Taslak yönetimi için custom hook
 * Form verilerini yerel depolamada taslak olarak kaydetme ve geri yükleme işlevselliği sağlar.
 */
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { DRAFT_KEY } from "../utils/storage-constants";
import { VehicleFormValues } from "../schemas";
import { useNotification } from "@/components/ui/notification";

interface UseDraftManagementProps {
  form: UseFormReturn<VehicleFormValues>;
  editMode: boolean;
}

interface UseDraftManagementResult {
  draft: Partial<VehicleFormValues> | null;
  showDraftDialog: boolean;
  setShowDraftDialog: (show: boolean) => void;
  useDraft: boolean | null;
  setUseDraft: (use: boolean | null) => void;
  saveDraft: (formData: Partial<VehicleFormValues>) => void;
  clearDraft: () => void;
}

/**
 * Taslak verilerinin yönetimi için custom hook
 * @param props - Taslak yönetimi için gerekli parametreler
 * @returns Taslak yönetimi için state ve fonksiyonlar
 */
export const useDraftManagement = ({
  form,
  editMode
}: UseDraftManagementProps): UseDraftManagementResult => {
  const [draft, setDraft] = useState<Partial<VehicleFormValues> | null>(null);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [useDraft, setUseDraft] = useState<boolean | null>(null);
  const { error: showError } = useNotification();

  // İlk yüklenme ve taslak kontrolü
  useEffect(() => {
    // Düzenleme modunda taslak kullanılmaz
    if (editMode) return;
    
    // Taslağı local storage'dan al
    const savedDraft = localStorage.getItem(DRAFT_KEY);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setDraft(parsedDraft);
        setShowDraftDialog(true);
      } catch (err) {
        showError("Kaylıtlı taslak verisi bozuk olduğu için yüklenemedi.");
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [editMode, showError]);

  // Taslak kullanma kararı verilirse
  useEffect(() => {
    if (useDraft === true && draft) {
      form.reset(draft);
    } else if (useDraft === false) {
      clearDraft();
    }
  }, [useDraft, draft, form]);

  /**
   * Formun mevcut durumunu taslak olarak kaydet
   * @param formData - Form verileri (ana form ve opsiyonel olarak ilişkili modüller)
   */
  const saveDraft = (formData: Partial<VehicleFormValues>) => {
    if (!editMode) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  };

  /**
   * Taslak verisini temizle
   */
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setDraft(null);
    setShowDraftDialog(false);
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
