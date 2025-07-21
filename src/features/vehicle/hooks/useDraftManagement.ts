/**
 * Taslak yönetimi için custom hook
 * Form verilerini yerel depolamada taslak olarak kaydetme ve geri yükleme işlevselliği sağlar.
 */
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { DRAFT_KEY } from "../utils/storage-constants";
import { VehicleCreateValues } from "../../vehicle/create/create-tabs/schema";
import { TransformedIncludedData } from "../utils/data-transformers"; // Yeni import

interface UseDraftManagementProps {
  form: UseFormReturn<VehicleCreateValues>;
  editMode: boolean;
}

interface UseDraftManagementResult {
  draft: (Partial<VehicleCreateValues> & { included?: TransformedIncludedData }) | null;
  showDraftDialog: boolean;
  setShowDraftDialog: (show: boolean) => void;
  useDraft: boolean | null;
  setUseDraft: (use: boolean | null) => void;
  // saveDraft, ana form verileriyle birlikte ilişkili modül verilerini de kabul edecek şekilde güncellendi
  saveDraft: (formData: Partial<VehicleCreateValues> & { included?: TransformedIncludedData }) => void;
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
  const [mounted, setMounted] = useState(false);
  const [draft, setDraft] = useState<(Partial<VehicleCreateValues> & { included?: TransformedIncludedData }) | null>(null);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [useDraft, setUseDraft] = useState<boolean | null>(null);

  // İlk yüklenme ve taslak kontrolü
  useEffect(() => {
    setMounted(true);
    
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
        console.error("Taslak ayrıştırma hatası:", err);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [editMode]);

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
  const saveDraft = (formData: Partial<VehicleCreateValues> & { included?: TransformedIncludedData }) => {
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
