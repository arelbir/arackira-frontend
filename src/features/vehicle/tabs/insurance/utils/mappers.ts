import { Insurance } from "../../../hooks/useInsurance";

// Tiplerin tanımları
export interface InsuranceType {
  id: number;
  name: string;
  description?: string;
}

export interface InsuranceCompany {
  id: number;
  name: string;
  description?: string;
}

export interface Currency {
  id: number;
  code?: string;
  name: string;
}

/**
 * Poliçe türü ID'sine göre uygun ismi bulur
 * @param typeId Poliçe türü ID'si
 * @param insuranceTypes Tür listesi
 * @returns Bulunan tür ismi veya default değer
 */
export const getInsuranceTypeName = (
  typeId: number | string | undefined, 
  insuranceTypes?: InsuranceType[]
): string => {
  if (!typeId) return "-";
  
  // ID'yi sayıya dönüştür
  const numericId = typeof typeId === 'string' ? Number(typeId) : typeId;
  
  // Listeden bul
  const foundType = insuranceTypes?.find(type => type.id === numericId);
  if (foundType?.name) return foundType.name;
  
  // Bulunamazsa bilinen değerleri kontrol et
  if (numericId === 1) return "15 Günlük Trafik";
  if (numericId === 2) return "Kasko";
  
  // Default değer
  return `Sigorta (${numericId})`;
};

/**
 * Şirket ID'sine göre uygun şirket adını bulur
 * @param companyId Şirket ID'si
 * @param companies Şirket listesi
 * @returns Bulunan şirket adı veya default değer
 */
export const getInsuranceCompanyName = (
  companyId: number | string | undefined, 
  companies?: InsuranceCompany[]
): string => {
  if (!companyId) return "-";
  
  // ID'yi sayıya dönüştür
  const numericId = typeof companyId === 'string' ? Number(companyId) : companyId;
  
  // Listeden bul
  const foundCompany = companies?.find(company => company.id === numericId);
  if (foundCompany?.name) return foundCompany.name;
  
  // Bulunamazsa bilinen değerleri kontrol et
  if (numericId === 1) return "Anadolu Sigorta";
  if (numericId === 2) return "Aksigorta";
  
  // Default değer
  return `Şirket (${numericId})`;
};

/**
 * Para birimi kodunu veya ID'sini uygun para birimi koduna dönüştürür
 * @param currencyValue Para birimi değeri (kod veya ID)
 * @param currencies Para birimi listesi
 * @returns Uygun para birimi kodu
 */
export const getCurrencyCode = (
  currencyValue: string | number | undefined,
  currencies?: Currency[]
): string => {
  if (!currencyValue) return "TL";
  
  // Eğer zaten kısa bir string ise direkt kullan
  if (typeof currencyValue === 'string' && currencyValue.length <= 3) {
    return currencyValue;
  }
  
  // ID ise listeden bul
  const currencyId = typeof currencyValue === 'string' ? Number(currencyValue) : currencyValue;
  const foundCurrency = currencies?.find(curr => curr.id === currencyId);
  
  return foundCurrency?.code || "TL";
};
