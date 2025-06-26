import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { getCurrentDate, getNewDate } from "@/lib/date-utils";

// Sigorta kaydı için tip tanımı
export interface InsuranceRecord {
  id?: string;
  insurance_type_id?: string;
  insurance_company_id?: string;
  agency_id?: string;
  policy_number?: string;
  policy_date?: string;
  start_date?: string;
  end_date?: string;
  premium_amount?: number;
  currency_id?: string;
  payment_type_id?: string;
  payment_account_id?: string;
  notes?: string;
  [key: string]: any; // Diğer olası alanlar için
}

// Form işleme hookları için tip tanımları
interface InsuranceFormOptions {
  control: any;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useInsuranceFormHandler({ control, onSuccess, onError }: InsuranceFormOptions) {
  // Drawer durumu için state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Form alanları için field array
  const { fields, append, remove, update } = useFieldArray({ 
    control, 
    name: "insurances" 
  });
  
  // Form açılışını hazırla - Drawer'ı açma işlemleri
  const handleAddNew = () => {
    setEditingIndex(null);
    setIsDrawerOpen(true);
    
    // Form başlangıç değerlerini ayarla
    const today = getCurrentDate();
    const endDate = getNewDate(today, 12);
    
    // Değerleri form açıldıktan sonra güncelle
    setTimeout(() => {
      const index = fields.length;
      const setValue = control._formState?.setValue || control.setValue;
      
      if (typeof setValue === 'function') {
        setValue(`insurances.${index}.start_date`, today);
        setValue(`insurances.${index}.policy_date`, today);
        setValue(`insurances.${index}.end_date`, endDate);
      }
    }, 100);
  };
  
  // Mevcut kaydı düzenlemeyi başlat
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsDrawerOpen(true);
  };
  
  // Sigorta kaydı silme işlemi
  const handleDelete = (index: number) => {
    if (confirm('Bu sigorta kaydını silmek istediğinizden emin misiniz?')) {
      remove(index);
      toast.success("Sigorta kaydı başarıyla silindi");
    }
  };
  
  // Sigorta kaydını yenileme (kopyalama ve tarihleri güncelleme)
  const handleRenew = (index: number) => {
    const current = fields[index] as InsuranceRecord;
    append({
      ...current,
      start_date: current.end_date || getCurrentDate(),
      policy_date: getCurrentDate(),
      end_date: getNewDate(current.end_date || getCurrentDate(), 12),
    });
    
    // Yeni eklenen kaydı düzenlemek için drawer'ı aç
    setEditingIndex(fields.length);
    setIsDrawerOpen(true);
  };
  
  // Form kaydetme işlemi
  const handleSave = (form: any) => {
    try {
      const formData = form.getValues('insurances');
      
      if (editingIndex !== null) {
        // Mevcut kaydı güncelle
        update(editingIndex, formData[editingIndex]);
        toast.success(`Sigorta kaydı başarıyla güncellendi`);
      } else {
        // Yeni kayıt ekle
        const newInsuranceIndex = fields.length;
        const newInsurance = formData[newInsuranceIndex];
        
        // Form kontrolü
        if (newInsurance && newInsurance.insurance_type_id) {
          // Yeni kayıt eklemek için append kullanılmalı
          append(newInsurance);
          toast.success(`Yeni sigorta kaydı başarıyla eklendi`);
        } else {
          toast.error(`Sigorta türü seçilmediği için kayıt eklenemedi`);
          return false; // İşlemin başarısız olduğunu bildir
        }
      }
      
      // Başarılı olduğunda drawer'ı kapat
      setIsDrawerOpen(false);
      
      // Başarı callback'ini çağır
      if (onSuccess) {
        onSuccess();
      }
      
      return true;
    } catch (error) {
      console.error('Sigorta kaydı eklenirken hata oluştu:', error);
      toast.error(`Kayıt sırasında bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      
      // Hata callback'ini çağır
      if (onError) {
        onError(error);
      }
      
      return false;
    }
  };
  
  return {
    isDrawerOpen,
    setIsDrawerOpen,
    editingIndex,
    fields,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleRenew,
    handleSave
  };
}
