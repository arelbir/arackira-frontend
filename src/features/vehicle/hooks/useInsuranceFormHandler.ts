import { useState, useEffect } from "react";
import { useFieldArray, UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getCurrentDate, getDateAfter, InsuranceRecord, INSURANCE_FIELD, INSURANCE_FIELDS } from "../create/create-tabs/tabs/insurance-constants";

// Form işleme hookları için tip tanımları
export interface InsuranceFormOptions {
  control: any;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useInsuranceFormHandler({ control, onSuccess, onError }: InsuranceFormOptions) {
  // Drawer durumu için state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newFormReady, setNewFormReady] = useState(false);
  
  // Form yönetimi için useForm hookunu kullan
  const methods = useForm();
  
  // Form alanları için field array
  const { fields, append, remove, update } = useFieldArray({ 
    control, 
    name: "insurances" 
  });
  
  // Form açılışını hazırla - Drawer'ı açma işlemleri
  const handleAddNew = () => {
    setEditingIndex(null);
    setIsDrawerOpen(true);
    setNewFormReady(true); // Form hazır işaretini aktifleştir
  };
  
  // useEffect ile form değerlerini ayarla (timeout yerine)  
  useEffect(() => {
    if (newFormReady && isDrawerOpen && editingIndex === null) {
      const index = fields.length;
      const setValue = control._formState?.setValue || control.setValue;
      const today = getCurrentDate();
      const endDate = getDateAfter(today, 12);
      
      if (typeof setValue === 'function') {
        // Burada React Hook Form API'sini kullanarak değerleri atıyoruz
        setValue(`insurances.${index}.${INSURANCE_FIELD.START_DATE}`, today);
        setValue(`insurances.${index}.${INSURANCE_FIELD.POLICY_DATE}`, today);
        setValue(`insurances.${index}.${INSURANCE_FIELD.END_DATE}`, endDate);
        setValue(`insurances.${index}.${INSURANCE_FIELD.CURRENCY_ID}`, 'TL');
      }
      
      // State'i sıfırla
      setNewFormReady(false);
    }
  }, [newFormReady, isDrawerOpen, editingIndex, fields.length, control]);

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
    
    // Yeni kayıt oluştur
    const newRecord = {
      ...current,
      [INSURANCE_FIELD.START_DATE]: current[INSURANCE_FIELD.END_DATE] || getCurrentDate(),
      [INSURANCE_FIELD.POLICY_DATE]: getCurrentDate(),
      [INSURANCE_FIELD.END_DATE]: getDateAfter(String(current[INSURANCE_FIELD.END_DATE] || getCurrentDate()), 12),
    };
    
    // Yeni kayıt ekle
    append(newRecord);
    
    // Yeni eklenen kaydın indexi
    const newIndex = fields.length;
    
    // Önemli: React'in state güncellemesini bir sonraki döngüde işleyeceğini hesaba katarak
    // methods.reset ile yeni form değerlerini doldurabiliriz
    setTimeout(() => {
      // Yeni eklenen kaydın indexini ayarla
      setEditingIndex(newIndex);
      
      // Form alan değerlerini manuel olarak doldur
      Object.entries(newRecord).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          methods.setValue(`${INSURANCE_FIELDS.BASE}.${newIndex}.${key}`, value);
        }
      });
      
      // Drawer'ı aç
      setIsDrawerOpen(true);
    }, 0);
  };
  
  // Form kaydetme işlemi
  const handleSave = (form: UseFormReturn<any>) => {
    try {
      // React Hook Form'un tüm doğrulamaları çalıştıran handleSubmit metodu kullanılıyor
      methods.handleSubmit((allValues) => {
        try {
          const formData = allValues['insurances'];
          
          if (editingIndex !== null) {
            // Mevcut kaydı güncelle
            update(editingIndex, formData[editingIndex]);
            toast.success(`Sigorta kaydı başarıyla güncellendi`);
          } else {
            // Yeni kayıt ekle
            const newInsuranceIndex = fields.length;
            const newInsurance = formData[newInsuranceIndex];
            
            // Form kontrolü
            if (newInsurance && newInsurance[INSURANCE_FIELD.INSURANCE_TYPE_ID]) {
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
        } catch (innerError) {
          console.error('Form verilerini işlerken hata:', innerError);
          if (onError) onError(innerError);
          return false;
        }
      })();
      
      return true; // Form başarıyla submit edildi
      
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
    handleSave,
    methods, // FormProvider için React Hook Form metotları
    remove   // Dialog'tan doğrudan silme işlemi için
  };
}
