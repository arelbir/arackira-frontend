/**
 * Araç formu context tipleri
 */
import { UseFormReturn } from "react-hook-form";
import { VehicleCreateValues } from "../../vehicle/create/create-tabs/schema";

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
  insurances: any[];
  setInsurances: React.Dispatch<React.SetStateAction<any[]>>;
  inspections: any[];
  setInspections: React.Dispatch<React.SetStateAction<any[]>>;
  hgs: any[];
  setHgs: React.Dispatch<React.SetStateAction<any[]>>;
  utts: any[];
  setUtts: React.Dispatch<React.SetStateAction<any[]>>;
  services: any[];
  setServices: React.Dispatch<React.SetStateAction<any[]>>;
  
  // API işlemleri
  submitWithRelated: () => Promise<any>;
  validateRequiredFields: () => { valid: boolean; errors: Record<string, string[]> };
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
  /** Düzenlenecek aracın ID'si */
  vehicleToEdit?: number;
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
