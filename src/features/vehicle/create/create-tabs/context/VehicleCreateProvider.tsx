"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleCreateSchema, VehicleCreateValues } from "../schema";
import { useNotification } from "@/components/ui/notification";
import { useDraftManagement } from "@/features/vehicle/hooks/useDraftManagement";
import { useVehicleEdit } from "@/features/vehicle/hooks/useVehicleEdit";
import { VehicleService } from "@/features/vehicle/services/VehicleService";
import { validateRequiredFields } from "@/features/vehicle/utils/form-helpers";
import { 
  VehicleFormContextType as VehicleFormContextTypeImport, 
  VehicleCreateProviderProps as VehicleCreateProviderPropsImport 
} from "@/features/vehicle/types/vehicle-form-context.types";

// Re-export types for use in other files
export type VehicleFormContextType = VehicleFormContextTypeImport;
export type VehicleCreateProviderProps = VehicleCreateProviderPropsImport;
import DraftDialog from "../components/DraftDialog";

// Context oluşturma
const VehicleFormContext = createContext<VehicleFormContextType | null>(null);

/**
 * Araç ve ilişkili modüllerini yöneten geliştirilmiş provider
 */
export const VehicleCreateProvider: React.FC<VehicleCreateProviderProps> = ({ 
  children, 
  defaultValues, 
  editMode = false, 
  vehicleToEdit 
}) => {
  // Temel durumlar
  const [isLoading, setIsLoading] = useState(editMode && !!vehicleToEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleId, setVehicleId] = useState<number | null>(vehicleToEdit || null);
  const { success, error: showError } = useNotification();
  
  // İlişkili modül state'leri
  const [insurances, setInsurances] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [hgs, setHgs] = useState<any[]>([]);
  const [utts, setUtts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  // Form tanımlama
  const methods = useForm<VehicleCreateValues>({
    resolver: zodResolver(vehicleCreateSchema),
    defaultValues: defaultValues || {},
    mode: "onChange",
  });

  // Draft yönetimi
  const { 
    showDraftDialog, 
    setShowDraftDialog, 
    setUseDraft, 
    saveDraft,
    clearDraft
  } = useDraftManagement({
    form: methods,
    editMode
  });

  // Düzenleme işlemleri
  const { 
    fetchVehicleData, 
    isLoading: isEditLoading, 
    error: editError 
  } = useVehicleEdit({
    form: methods,
    editMode,
    setVehicleId,
    vehicleId
  });

  // Verileri fetch etme
  const handleFetchVehicleData = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await VehicleService.fetchVehicleWithRelated(id);
      
      // İlişkili modülleri state'lere yükle
      if (response?.data) {
        if (response.data.insurances) setInsurances(response.data.insurances);
        if (response.data.inspections) setInspections(response.data.inspections);
        if (response.data.hgs) setHgs(response.data.hgs);
        if (response.data.utts) setUtts(response.data.utts);
        if (response.data.services) setServices(response.data.services);
      }
      
      return response;
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Araç verileri çekilirken hata oluştu');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Zorunlu alanların varlığını kontrol eden fonksiyon
   */
  const checkRequiredFields = () => {
    return validateRequiredFields(
      methods.getValues(),
      { inspections, utts, hgs, services }
    );
  };
  
  /**
   * Tüm ilişkili modül verilerini bir arada gönderen fonksiyon
   */
  const submitWithRelated = async () => {
    setIsSubmitting(true);
    
    try {
      // Form validasyonu
      const validation = await methods.trigger();
      if (!validation) {
        showError("Form alanlarında hatalar var. Lütfen kontrol edin.", "Form Hatası");
        console.log("Form hataları:", methods.formState.errors);
        return null;
      }
      
      // Zorunlu alan kontrolü
      const requiredFieldsCheck = checkRequiredFields();
      if (!requiredFieldsCheck.valid) {
        showError(
          "Bazı zorunlu alanlar eksik. Lütfen kontrol edin.",
          "Zorunlu Alan Hatası"
        );
        console.log("Zorunlu alan hataları:", requiredFieldsCheck.errors);
        return null;
      }
      
      // Form verilerini al
      const formValues = methods.getValues();
      
      // Servisi kullanarak API çağrısı yap
      const response = await VehicleService.submitWithRelated(
        formValues, 
        { insurances, inspections, utts, hgs, services },
        editMode,
        vehicleId || undefined
      );
      
      // Hata kontrolü
      if (response?.data?.errors && Object.keys(response.data.errors).length > 0) {
        // İlişkili modüllerdeki hatalar
        const errorMessages: string[] = [];
        
        for (const [module, moduleErrors] of Object.entries(response.data.errors)) {
          if (Array.isArray(moduleErrors) && moduleErrors.length > 0) {
            moduleErrors.forEach(err => {
              errorMessages.push(`${module.toUpperCase()}: ${err.error || JSON.stringify(err)}`);
            });
          }
        }
        
        if (errorMessages.length > 0) {
          showError(
            `Bazı modüllerde kayıt sırasında hata oluştu:\n${errorMessages.join('\n')}`,
            "Kayıt Hatası"
          );
        }
      } 
      // Tüm işlem başarılı
      else {
        success(
          "Araç ve ilişkili verileri başarıyla kaydedildi.",
          editMode ? "Araç güncellendi" : "Araç oluşturuldu"
        );
        
        if (!editMode && response?.data?.vehicle?.id) {
          setVehicleId(response.data.vehicle.id);
        }
        
        // Draft temizle
        clearDraft();
      }
      
      return response;
    } catch (error) {
      console.error('submitWithRelated error:', error);
      showError(
        error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu",
        "Hata"
      );
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form değişikliklerini izleyerek draft kaydet (düzenleme modunda değil)
  useEffect(() => {
    if (!editMode) {
      const subscription = methods.watch((value) => {
        saveDraft(value as Partial<VehicleCreateValues>);
      });
      
      return () => subscription.unsubscribe();
    }
  }, [editMode, methods, saveDraft]);

  return (
    <>
      {/* Draft dialog */}
      <DraftDialog 
        open={showDraftDialog} 
        onOpenChange={setShowDraftDialog} 
        onDraftDecision={(use) => setUseDraft(use)} 
      />
      
      {/* Context provider */}
      <VehicleFormContext.Provider value={{ 
        form: methods, 
        vehicleId, 
        setVehicleId, 
        editMode, 
        isLoading: isLoading || isEditLoading,
        isSubmitting,
        // İlişkili modül verileri
        insurances,
        setInsurances,
        inspections,
        setInspections,
        hgs,
        setHgs,
        utts,
        setUtts,
        services,
        setServices,
        // Fonksiyonlar
        submitWithRelated,
        validateRequiredFields: checkRequiredFields
      }}>
        <FormProvider {...methods}>{children}</FormProvider>
      </VehicleFormContext.Provider>
    </>
  );
};

/**
 * Araç formu ve ilgili verilere erişim için custom hook
 */
export const useVehicleForm = () => {
  const context = useContext(VehicleFormContext);
  if (!context) {
    throw new Error("useVehicleForm must be used within a VehicleCreateProvider");
  }
  return context;
};
