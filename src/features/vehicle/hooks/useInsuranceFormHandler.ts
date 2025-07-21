import { useState, useEffect, useCallback } from "react";
import { useFieldArray, UseFormReturn, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getCurrentDate, getDateAfter, InsuranceRecord, INSURANCE_FIELD, INSURANCE_FIELDS } from "../create/create-tabs/tabs/insurance/insurance-constants";
import { useVehicleForm } from "../create/create-tabs/context/VehicleCreateProvider";
import { TransformedInsurance } from "../utils/data-transformers"; // TransformedInsurance import edildi

// Form işleme hookları için tip tanımları
export interface InsuranceFormOptions {
  control: UseFormReturn<any>['control']; // Daha spesifik tip
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * Sigorta formu alanlarını yönetmek için custom hook.
 * VehicleCreateProvider'dan sigorta verilerini alır ve kendi iç formunu senkronize eder.
 * @param options - Hook seçenekleri (kontrol nesnesi, başarı/hata callback'leri)
 * @returns isDrawerOpen: Drawer durumu, editingIndex: Düzenlenen kaydın indeksi, fields: Form alanları, vb.
 */
export function useInsuranceFormHandler({ control, onSuccess, onError }: InsuranceFormOptions) {
  // Drawer durumu için state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newFormReady, setNewFormReady] = useState(false);
  
  // VehicleCreateProvider'dan ilgili verileri ve yükleme durumunu al
  const { relatedData, setRelatedData, isLoading } = useVehicleForm();
  const contextInsurances = relatedData.insurances;

  // Context'teki sigorta verilerini güncellemek için bir callback oluştur
  const setContextInsurances = useCallback((updatedInsurances: TransformedInsurance[]) => {
    setRelatedData({
      ...relatedData,
      insurances: updatedInsurances,
    });
  }, [relatedData, setRelatedData]);
  
  // Form yönetimi için useForm hookunu kullan
  const methods = useForm();
  
  // Form alanları için field array
  const { fields, append, remove, update } = useFieldArray({ 
    control, 
    name: "insurances" 
  });
  
  // Context'ten gelen sigorta verilerini field array'e yükle
  useEffect(() => {
    if (Array.isArray(contextInsurances) && contextInsurances.length > 0) {
      // Sadece fields boşsa ve context verileri geldiyse append et
      // Aksi takdirde, React Hook Form'un kendi yönetimiyle çakışabilir
      if (fields.length === 0) {
        contextInsurances.forEach(insurance => {
          append(insurance as TransformedInsurance); // Tip dönüşümü eklendi
        });
      }
    }
  }, [contextInsurances, fields.length, append]);
  
  // Form açılışını hazırla - Drawer'ı açma işlemleri
  const handleAddNew = useCallback(() => {
    setEditingIndex(null);
    setIsDrawerOpen(true);
    setNewFormReady(true); // Form hazır işaretini aktifleştir
  }, []);
  
  // useEffect ile form değerlerini ayarla
  useEffect(() => {
    if (newFormReady && isDrawerOpen && editingIndex === null) {
      const index = fields.length;
      const today = getCurrentDate();
      const endDate = getDateAfter(today, 12);
      
      // Doğrudan methods.setValue kullanın
      methods.setValue(`insurances.${index}.${INSURANCE_FIELD.START_DATE}`, today);
      methods.setValue(`insurances.${index}.${INSURANCE_FIELD.POLICY_DATE}`, today);
      methods.setValue(`insurances.${index}.${INSURANCE_FIELD.END_DATE}`, endDate);
      methods.setValue(`insurances.${index}.${INSURANCE_FIELD.CURRENCY_ID}`, 'TL');
      
      setNewFormReady(false); // State'i sıfırla
    }
  }, [newFormReady, isDrawerOpen, editingIndex, fields.length, methods]); // methods bağımlılığı eklendi

  // Mevcut kaydı düzenlemeyi başlat
  const handleEdit = useCallback((index: number) => {
    setEditingIndex(index);
    setIsDrawerOpen(true);
  }, []);
  
  // Sigorta kaydı silme işlemi
  const handleDelete = useCallback((index: number) => {
    toast.info("Bu sigorta kaydını silmek istediğinizden emin misiniz?", {
      action: {
        label: "Sil",
        onClick: () => {
          remove(index);
          // Context'teki sigorta verilerini de güncelle
          const updatedInsurances = methods.getValues().insurances;
          setContextInsurances(updatedInsurances);
          toast.success("Sigorta kaydı başarıyla silindi");
        },
      },
      duration: 5000, // Kullanıcıya karar vermesi için süre ver
    });
  }, [remove, methods, setContextInsurances]);
  
  // Sigorta kaydını yenileme (kopyalama ve tarihleri güncelleme)
  const handleRenew = useCallback((index: number) => {
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
    const newIndex = fields.length; // append sonrası fields.length bir artar
    
    // Yeni eklenen kaydın indexini ayarla ve drawer'ı aç
    setEditingIndex(newIndex);
    setIsDrawerOpen(true);

    // Form alan değerlerini manuel olarak doldur (bir sonraki render'da)
    // Bu kısım, append sonrası React Hook Form'un değerleri otomatik doldurması bekleniyorsa gereksiz olabilir.
    // Ancak, anında değer ataması için kullanılabilir.
    Object.entries(newRecord).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        methods.setValue(`insurances.${newIndex}.${key}`, value);
      }
    });

  }, [append, fields.length, methods]);
  
  // Form kaydetme işlemi
  const handleSave = useCallback(() => {
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
              return; // İşlemi durdur
            }
          }
          
          // Başarılı olduğunda drawer'ı kapat
          setIsDrawerOpen(false);
          setEditingIndex(null); // Düzenleme indeksini sıfırla
          
          // Context'teki sigorta verilerini de güncelle
          const updatedInsurances = methods.getValues().insurances;
          setContextInsurances(updatedInsurances);

          // Başarı callback'ini çağır
          if (onSuccess) {
            onSuccess();
          }
          
        } catch (innerError) {
          console.error('Form verilerini işlerken hata:', innerError);
          if (onError) onError(innerError);
          toast.error(`Kayıt sırasında bir hata oluştu: ${innerError instanceof Error ? innerError.message : 'Bilinmeyen hata'}`);
        }
      }, (errors) => {
        console.error("Doğrulama Hataları:", errors);
        toast.error("Lütfen formdaki hataları düzeltin.");
      })();
      
    } catch (error) {
      console.error('Sigorta kaydı eklenirken hata oluştu:', error);
      toast.error(`Kayıt sırasında bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
      
      // Hata callback'ini çağır
      if (onError) {
        onError(error);
      }
    }
  }, [
    methods, 
    editingIndex, 
    update, 
    append, 
    fields.length, 
    setIsDrawerOpen, 
    setEditingIndex, 
    setContextInsurances, 
    onSuccess, 
    onError
  ]);
  
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
