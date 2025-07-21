/**
 * Araç formu context tipleri
 */
import { UseFormReturn } from "react-hook-form";
import { VehicleCreateValues } from "../../vehicle/create/create-tabs/schema";
import { TransformedIncludedData } from "../utils/data-transformers";

/**
 * Araç ve ilişkili modül verileri için context tipi tanımı
 */
export interface VehicleFormContextType {
  // Form ve temel durum bilgileri
  form: UseFormReturn<VehicleCreateValues>;
  vehicleId: number | null;
  setVehicleId: (id: number) => void;
  editMode: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  
  // İlişkili modül verileri ve yönetim metodları
  relatedData: TransformedIncludedData;
  setRelatedData: (data: TransformedIncludedData) => void;
  
  // API işlemleri
  submitWithRelated: () => Promise<any>;
  validateRequiredFields: () => { valid: boolean; errors: Record<string, string[]> };

  // GPS Düzenleme State'leri
  editingIndex: number | null;
  setEditingIndex: React.Dispatch<React.SetStateAction<number | null>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Araç create provider için props tipi
 */
export interface VehicleCreateProviderProps {
  /** React Children */
  children: React.ReactNode;
  /** Form için varsayılan değerler */
  defaultValues?: Partial<VehicleCreateValues>;
  /** Düzenleme modu aktif mi */
  editMode?: boolean;
  /** Düzenlenecek aracın verileri */
  vehicleToEdit?: Partial<VehicleCreateValues>;
}

/**
 * API yanıt tipi
 */
export interface ApiResponse<T = any> {
  data?: T;
  errors?: Record<string, any[]>;
  message?: string;
}

/**
 * Validasyon sonuç tipi
 */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string[]>;
}
