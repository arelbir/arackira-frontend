"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleCreateSchema, VehicleCreateValues } from "../schema";
import { useNotification } from "@/components/ui/notification";
import { useDraftManagement } from "@/features/vehicle/hooks/useDraftManagement";
import { useVehicleEdit } from "@/features/vehicle/hooks/useVehicleEdit";
import { validateRequiredFields } from "@/features/vehicle/utils/form-helpers";
import { apiRequest } from "@/lib/api-client";
import {
  VehicleFormContextType as VehicleFormContextTypeImport,
  VehicleCreateProviderProps as VehicleCreateProviderPropsImport
} from "@/features/vehicle/types/vehicle-form-context.types";
import {
  TransformedInsurance,
  TransformedInspection,
  TransformedUtts,
  TransformedHgs,
  TransformedGps,
  TransformedService,
  transformAPIResponse,
  transformFormToAPI,
  TransformedAPIResponse,
  TransformedIncludedData // TransformedIncludedData eklendi
} from "@/features/vehicle/utils/data-transformers";
import DraftDialog from "../components/DraftDialog";

// Re-export types for use in other files
export type VehicleFormContextType = VehicleFormContextTypeImport;
export type VehicleCreateProviderProps = VehicleCreateProviderPropsImport;

// API yanıtı için daha spesifik bir tip
interface ApiResponse<T> {
  data?: T;
  errors?: { [key: string]: string[] | string };
  message?: string;
}

// useDraftManagement kancasının beklenen dönüş tipi (hatalara göre güncellendi)
interface UseDraftManagementResult {
  showDraftDialog: boolean;
  setShowDraftDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setUseDraft: React.Dispatch<React.SetStateAction<boolean>>;
  saveDraft: (mainFormValues: Partial<VehicleCreateValues> & { included?: TransformedIncludedData }) => void; // Tüm veriyi kabul edecek şekilde güncellendi
  clearDraft: () => void;
  // loadDraft bu kancanın dönüş tipinde yok, bu yüzden dışarıdan yönetilecek.
}

// useVehicleEdit kancasının beklenen dönüş tipi (hatalara göre güncellendi)
interface UseVehicleEditResult {
  isLoading: boolean;
  error: any;
  // onDataFetched prop'u kaldırıldığı için, kancanın dönüştürülmüş veriyi doğrudan döndürdüğünü varsayalım.
  // Bu, kancanın içindeki API çağrısından sonra veriyi dönüştürüp döndürmesi gerektiği anlamına gelir.
  transformedData?: TransformedAPIResponse;
}


const VehicleFormContext = createContext<VehicleFormContextType | null>(null);

export const VehicleCreateProvider: React.FC<VehicleCreateProviderProps> = ({
  children,
  defaultValues,
  editMode = false,
  vehicleToEdit,
}) => {
  // --- 1. STATE AND FORM INITIALIZATION ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vehicleId, setVehicleId] = useState<number | null>(
    vehicleToEdit && 'id' in vehicleToEdit && typeof vehicleToEdit.id === 'number' ? vehicleToEdit.id : null
  );
  const { success, error: showError } = useNotification();

  const methods = useForm<VehicleCreateValues>({
    resolver: zodResolver(vehicleCreateSchema),
    defaultValues: defaultValues || {},
    mode: "onChange",
  });

  const [relatedData, setRelatedDataState] = useState<TransformedIncludedData>({
    insurances: [], inspections: [], hgs: [], utts: [], gps: [], services: []
  });

  // State for managing GPS editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- 2. HOOKS AND CALLBACKS ---

  const { draft, showDraftDialog, setShowDraftDialog, useDraft, setUseDraft, saveDraft, clearDraft } = useDraftManagement({
    form: methods,
    editMode,
  });

  const setRelatedData = useCallback((data: TransformedIncludedData) => {
    setRelatedDataState(data);
  }, []);

  const handleFetchSuccess = useCallback((data: TransformedAPIResponse) => {
    methods.reset(data.vehicleData);
    setRelatedData(data.included);
  }, [methods, setRelatedData]);

  const { isLoading } = useVehicleEdit({
    editMode,
    vehicleId,
    setVehicleId, // Pass the setter function
    onFetchSuccess: handleFetchSuccess, // Pass the handler
    onRelatedModulesFetched: setRelatedData, // Pass the handler
  });

  // --- 3. EFFECTS ---

  // EFFECT 1: Handle initial data from props (for edit mode)
  useEffect(() => {
    if (editMode && vehicleToEdit) {
      methods.reset(vehicleToEdit);
    }
  }, [editMode, vehicleToEdit, methods]);

  // EFFECT 2: Handle user's decision on using a draft
  useEffect(() => {
    if (useDraft && draft) {
      methods.reset(draft as Partial<VehicleCreateValues>);
      if (draft.included) {
        setRelatedData(draft.included);
      }
    } else if (useDraft === false) {
      clearDraft();
    }
  }, [useDraft, draft, methods, setRelatedData, clearDraft]);

  // EFFECT 3: Watch for form changes to save draft
  useEffect(() => {
    if (!editMode) {
      const subscription = methods.watch((value) => {
        saveDraft({ ...(value as Partial<VehicleCreateValues>), included: relatedData });
      });
      return () => subscription.unsubscribe();
    }
  }, [editMode, methods, saveDraft, relatedData]);

  // --- 4. HELPER AND SUBMIT FUNCTIONS ---
  const checkRequiredFields = useCallback(() => {
    return validateRequiredFields(methods.getValues(), relatedData);
  }, [methods, relatedData]);

  const submitWithRelated = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const requiredFieldsCheck = checkRequiredFields();
      if (!requiredFieldsCheck.valid) {
        showError("Bazı zorunlu alanlar eksik.", "Zorunlu Alan Hatası");
        return null;
      }

      const formData = methods.getValues();
      const apiPayload = transformFormToAPI(formData, relatedData);

      const response: ApiResponse<{ vehicle?: { id: number } }> = await apiRequest({
        url: editMode && vehicleId ? `vehicles/${vehicleId}` : 'vehicles',
        method: editMode ? 'PUT' : 'POST',
        body: apiPayload,
        requiresAuth: true,
      });

      if (response && response.errors) {
        const errorMessages = Object.entries(response.errors).map(([module, errs]) =>
          `${module.toUpperCase()}: ${Array.isArray(errs) ? errs.map((e: any) => (typeof e === 'object' && e !== null && 'error' in e) ? e.error : JSON.stringify(e)).join(', ') : errs}`
        );
        showError(`Kayıt sırasında hata: ${errorMessages.join('\n')}`, "Kayıt Hatası");
      } else {
        success(editMode ? "Araç güncellendi" : "Araç oluşturuldu");
        clearDraft();
        if (!editMode && response?.data?.vehicle) {
          setVehicleId(response.data.vehicle.id);
          methods.reset({});
          setRelatedDataState({ insurances: [], inspections: [], hgs: [], utts: [], gps: [], services: [] });
        } else if (editMode) {
          // In edit mode, refetching is handled by useVehicleEdit if vehicleId changes.
          // We might want to manually trigger a refetch or update state here if the API returns data.
        }
      }
      return response;
    } catch (error) {
      showError(error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu", "Hata");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    editMode,
    vehicleId,
    methods,
    relatedData,
    checkRequiredFields,
    showError,
    success,
    clearDraft,
  ]);

  // --- 5. RENDER ---

  const contextValue = useMemo(() => ({
    form: methods,
    vehicleId,
    setVehicleId,
    editMode,
    isLoading,
    isSubmitting,
    relatedData,
    setRelatedData,
    submitWithRelated,
    validateRequiredFields: checkRequiredFields,
    editingIndex,
    setEditingIndex,
    isEditing,
    setIsEditing,
  }), [
    methods,
    vehicleId,
    editMode,
    isLoading,
    isSubmitting,
    relatedData,
    setRelatedData,
    submitWithRelated,
    checkRequiredFields,
    editingIndex,
    setEditingIndex,
    isEditing,
    setIsEditing,
    setVehicleId, // Add setVehicleId to dependency array
  ]);

  return (
    <>
      <DraftDialog
        open={showDraftDialog}
        onOpenChange={setShowDraftDialog}
        onDraftDecision={setUseDraft}
      />
      <VehicleFormContext.Provider value={contextValue}>
        <FormProvider {...methods}>{children}</FormProvider>
      </VehicleFormContext.Provider>
    </>
  );
};

export const useVehicleForm = () => {
  const context = useContext(VehicleFormContext);
  if (!context) {
    throw new Error("useVehicleForm must be used within a VehicleCreateProvider");
  }
  return context;
};
