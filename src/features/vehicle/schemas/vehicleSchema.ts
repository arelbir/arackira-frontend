import { z } from "zod";

// Zod şemasından form değerlerini çıkarmak için kullanılacak tip
// infer yerine manuel ve kesin tip tanımı yapıyoruz
export type VehicleFormValues = {
  // Temel Kayıt
  chassis_number: string;
  branch_id: number | null;
  tsb_code: string | null;
  supplier_id: number | null;
  purchase_price: number | null;
  invoice_date: string | null;
  vehicle_status_id: number;

  // Araç Detayları
  license_plate: string;
  brand_id: number | null;
  model_id: number | null;
  package_id: number | null;
  engine_no: string | null;
  engine_power: string | null;
  engine_volume: number | null;
  fuel_type_id: number | null;
  transmission_type_id: number | null;
  color_id: number | null;
  
  // Belge Bilgileri
  first_registration_date: string | null;
  registration_date: string | null;
  inspection_expiry_date: string | null;
  next_maintenance_date: string | null;
  exhaust_emission_expiry_date: string | null;
  
  // Sigorta ve Kasko
  insurance_type_id: number | null;
  insurance_company_id: number | null;
  insurance_policy_no: string | null;
  insurance_start_date: string | null;
  insurance_end_date: string | null;
  insurance_price: number | null;
  insurance_currency_id: number | null;
  
  kasko_company_id: number | null;
  kasko_policy_no: string | null;
  kasko_start_date: string | null;
  kasko_end_date: string | null;
  kasko_price: number | null;
  kasko_currency_id: number | null;
};

export const vehicleSchema = z.object({
  // Temel Kayıt tab
  chassis_number: z.string().min(1, "Şasi numarası zorunludur"),
  branch_id: z.number().optional().nullable(),
  tsb_code: z.string().optional().nullable(),
  supplier_id: z.number().optional().nullable(),
  purchase_price: z.number().optional().nullable(),
  invoice_date: z.string().optional().nullable(),
  vehicle_status_id: z.number().min(1, "Araç statüsü zorunludur"),

  // Araç Detayları tab
  license_plate: z.string().optional().nullable(),
  brand_id: z.number().optional().nullable(),
  model_id: z.number().optional().nullable(),
  package_id: z.number().optional().nullable(),
  engine_no: z.string().optional().nullable(),
  engine_power: z.string().optional().nullable(),
  engine_volume: z.number().optional().nullable(),
  fuel_type_id: z.number().optional().nullable(),
  transmission_type_id: z.number().optional().nullable(),
  color_id: z.number().optional().nullable(),
  
  // Belge Bilgileri tab
  first_registration_date: z.string().optional().nullable(),
  registration_date: z.string().optional().nullable(),
  inspection_expiry_date: z.string().optional().nullable(),
  next_maintenance_date: z.string().optional().nullable(),
  exhaust_emission_expiry_date: z.string().optional().nullable(),
  
  // Sigorta ve Kasko tab
  insurance_type_id: z.number().optional().nullable(),
  insurance_company_id: z.number().optional().nullable(),
  insurance_policy_no: z.string().optional().nullable(),
  insurance_start_date: z.string().optional().nullable(),
  insurance_end_date: z.string().optional().nullable(),
  insurance_price: z.number().optional().nullable(),
  insurance_currency_id: z.number().optional().nullable(),
  
  kasko_company_id: z.number().optional().nullable(),
  kasko_policy_no: z.string().optional().nullable(),
  kasko_start_date: z.string().optional().nullable(),
  kasko_end_date: z.string().optional().nullable(),
  kasko_price: z.number().optional().nullable(),
  kasko_currency_id: z.number().optional().nullable(),
});

// Her iki şema tipini de kabul edecek bir birleşik tip tanımlıyoruz
// ZodObject veya ZodEffects olabilir
export type VehicleSchema = z.ZodType<any, any, any>;

// Koşullu validasyon kuralları
export const getConditionalValidationSchema = (values: any): VehicleSchema => {
  // Referans olarak orijinal şemayı alıyoruz
  // TypeScript'in her refine sonrası dönen tipin değiştiğini bilmesini istediğimiz için
  // bir değişkene atayıp tip baskısı (type assertion) yapmıyoruz
  let schema: VehicleSchema = vehicleSchema;

  // Eğer marka seçilmişse, model zorunlu olsun
  if (values.brand_id) {
    schema = schema.refine(
      (data) => !!data.model_id,
      {
        message: "Marka seçildiğinde model seçimi zorunludur",
        path: ["model_id"],
      }
    );
  }

  // Eğer sigorta tipi seçilmişse, sigorta şirketi zorunlu olsun
  if (values.insurance_type_id) {
    schema = schema.refine(
      (data) => !!data.insurance_company_id,
      {
        message: "Sigorta tipi seçildiğinde sigorta şirketi seçimi zorunludur",
        path: ["insurance_company_id"],
      }
    );
  }

  // Eğer sigorta şirketi seçilmişse, poliçe numarası zorunlu olsun
  if (values.insurance_company_id) {
    schema = schema.refine(
      (data) => !!data.insurance_policy_no,
      {
        message: "Sigorta şirketi seçildiğinde poliçe numarası girişi zorunludur",
        path: ["insurance_policy_no"],
      }
    );
  }

  // Hem ZodObject hem de ZodEffects tiplerini kabul eden
  // VehicleSchema tipinde dönüş yapıyoruz
  return schema;
};

// Varsayılan değerler, VehicleFormValues tipiyle tam uyumlu olacak
export const getDefaultValues = (): VehicleFormValues => ({
  chassis_number: "",
  branch_id: 1,
  tsb_code: "",
  supplier_id: null,
  purchase_price: null,
  invoice_date: null,
  vehicle_status_id: 0, // Mutlaka bir değer olmalı, ön seçim için 0
  
  license_plate: "",
  brand_id: null,
  model_id: null,
  package_id: null,
  engine_no: "",
  engine_power: "",
  engine_volume: null,
  fuel_type_id: null,
  transmission_type_id: null,
  color_id: null,
  
  first_registration_date: null,
  registration_date: null,
  inspection_expiry_date: null,
  next_maintenance_date: null,
  exhaust_emission_expiry_date: null,
  
  insurance_type_id: null,
  insurance_company_id: null,
  insurance_policy_no: "",
  insurance_start_date: null,
  insurance_end_date: null,
  insurance_price: null,
  insurance_currency_id: null,
  
  kasko_company_id: null,
  kasko_policy_no: "",
  kasko_start_date: null,
  kasko_end_date: null,
  kasko_price: null,
  kasko_currency_id: null,
});

// Form değerlerinin tipini tamamlamak için dışa aktarıyoruz
export default vehicleSchema;
