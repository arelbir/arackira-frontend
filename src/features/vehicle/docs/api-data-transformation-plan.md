# Araç Modülü Veri Dönüşüm ve Eşleştirme Planı

## İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Mevcut API Yapısı](#mevcut-api-yapısı)
3. [Mevcut Frontend Yapısı](#mevcut-frontend-yapısı)
4. [Sorunlar ve Hedefler](#sorunlar-ve-hedefler)
5. [Çözüm Mimarisi](#çözüm-mimarisi)
    - [Merkezi Veri Dönüşüm Katmanı](#merkezi-veri-dönüşüm-katmanı)
    - [Alan Adı Standartlaştırma](#alan-adı-standartlaştırma)
    - [Tarih İşleme Stratejisi](#tarih-işleme-stratejisi)
6. [Uygulama Adımları](#uygulama-adımları)
7. [Modül Bazında Dönüşüm Şemaları](#modül-bazında-dönüşüm-şemaları)
    - [Ana Araç Verileri](#ana-araç-verileri)
    - [Sigorta Modülü](#sigorta-modülü)
    - [Muayene Modülü](#muayene-modülü)
    - [UTTS Modülü](#utts-modülü)
    - [HGS Modülü](#hgs-modülü)
8. [Test ve Doğrulama Planı](#test-ve-doğrulama-planı)
9. [Bakım ve Genişletme](#bakım-ve-genişletme)

## Genel Bakış

Bu doküman, araç modülünde API'den gelen verilerin frontend'e doğru, tutarlı ve DRY (Don't Repeat Yourself) prensiplerine uygun şekilde eşleştirilmesi için bir plan sunmaktadır. Amaç, veri akışını merkezi hale getirmek, kod tekrarını azaltmak ve bakımı kolaylaştırmaktır.

## Mevcut API Yapısı

`/api/vehicles/[id]/complete` endpoint'i şu yapıda veri döndürmektedir:

```json
{
  "data": {
    "id": 11,
    "plate_number": "34ABC124",
    "branch_id": 1,
    "vehicle_type_id": 2,
    "brand_id": 1,
    "model_id": 1,
    "fuel_type_id": 1,
    "model_year": 2022,
    "color_id": 1,
    "chassis_number": "XYZ123446789",
    "engine_number": "ENG987634321",
  
    "vehicle_km": 25000,
    "vehicle_status_id": 1,
    "tsb_code": "1111111",
    "is_draft": false,
    "supplier_id": 1,
    "purchase_price": "2.00",
    "invoice_date": "2025-07-13T21:00:00.000Z"
  },
  "included": {
    "insurances": [
      {
        "id": 2,
        "vehicle_id": 11,
        "insurance_type_id": 1,
        "insurance_company_id": 1,
        "policy_number": "12345232",
        "tramer": "0",
        "start_date": "2025-05-22T21:00:00.000Z",
        "end_date": "2025-05-22T21:00:00.000Z",
        "total_amount": "165.00",
        "currency": "TL",
        "description": "string",
        "created_at": "2025-05-23T19:57:00.393Z"
      }
    ],
    "inspections": [
      {
        "id": 1,
        "vehicle_id": 11,
        "inspection_date": "2025-05-22T21:00:00.000Z",
        "expiry_date": "2025-05-22T21:00:00.000Z",
        "created_at": "2025-05-23T20:25:21.982Z",
        "updated_at": "2025-05-23T20:25:21.982Z"
      }
    ],
    "utts": [
      {
        "id": 1,
        "vehicle_id": 11,
        "purchase_date": "2025-06-22T21:00:00.000Z",
        "installation_date": "2025-06-22T21:00:00.000Z",
        "utts_code": "asdasdasd123123",
        "created_at": "2025-06-23T10:13:03.181Z",
        "updated_at": "2025-06-23T10:13:03.181Z"
      }
    ],
    "hgs": [
      {
        "id": 2,
        "vehicle_id": 11,
        "hgs_place": "asda",
        "hgs_tag_no": "sdasd",
        "hgs_vehicle_class": "asd",
        "is_active": true,
        "created_at": "2025-06-15T18:44:31.334Z",
        "updated_at": "2025-06-15T18:44:31.334Z"
      }
    ]
  }
}
```

## Mevcut Frontend Yapısı

Frontend'de şu ana bileşenler veri akışını yönetiyor:

1. **VehicleCreateProvider**: Merkezi context ve state yönetimi
2. **useVehicleEdit**: Düzenleme modunda veri çekme ve dönüştürme
3. **Tab Bileşenleri**: PurchaseTab, InsuranceTab, vb.
4. **Form Bileşenleri**: Formları oluşturan alt bileşenler

Mevcut durumda veri dönüşümleri tutarsız yapılıyor ve bazı tablarda veri düzgün gösterilemiyor.

## Sorunlar ve Hedefler

### Sorunlar
1. Tutarsız tarih formatlaması ve işleme
2. Alan adı eşleştirme sorunları (ör: currency vs currency_id)
3. Her modülde farklı veri dönüşüm stratejileri
4. Kod tekrarı ve bakım zorluğu
5. İlişkili modüllerde veri gösteriminde eksiklikler

### Hedefler
1. Merkezi veri dönüşüm katmanı oluşturmak
2. Tutarlı alan adları ve form mapping sistemi kurgulamak
3. Tarih işleme için merkezi ve tutarlı bir yaklaşım belirlemek
4. İlişkili modüllerin veri gösterimini iyileştirmek
5. Kod tekrarını azaltarak bakımı kolaylaştırmak

## Çözüm Mimarisi

### Merkezi Veri Dönüşüm Katmanı

Uygulama içerisinde `/src/features/vehicle/utils/data-transformers.ts` dosyasında merkezi dönüşüm fonksiyonları oluşturulacak:

```typescript
// /src/features/vehicle/utils/data-transformers.ts
import { formatDateForForm } from "@/lib/date-utils";

/**
 * API yanıtını frontend formlarına uygun formata dönüştürür
 */
export const transformAPIResponse = (response: any) => {
  const { data, included } = response;
  
  // Ana araç verilerini transform et - tarih alanlarını düzelt
  const vehicleData = {
    ...data,
    invoice_date: formatDateForForm(data.invoice_date)
  };
  
  // İlişkili verileri transform et
  const transformedIncluded = {
    insurances: mapInsurances(included?.insurances || []),
    inspections: mapInspections(included?.inspections || []),
    utts: mapUtts(included?.utts || []),
    hgs: included?.hgs || []
  };
  
  return { vehicleData, included: transformedIncluded };
};

/**
 * Sigorta verilerini form yapısına uygun hale getirir
 */
const mapInsurances = (insurances: any[]) => {
  return insurances.map(insurance => ({
    ...insurance,
    start_date: formatDateForForm(insurance.start_date),
    end_date: formatDateForForm(insurance.end_date),
    policy_date: formatDateForForm(insurance.policy_date),
    // Alan adı uyumluluğu için dönüşümler
    currency_id: insurance.currency, // Frontend'de currency_id kullanılıyorsa
  }));
};

/**
 * Muayene verilerini form yapısına uygun hale getirir
 */
const mapInspections = (inspections: any[]) => {
  return inspections.map(inspection => ({
    ...inspection,
    inspection_date: formatDateForForm(inspection.inspection_date),
    expiry_date: formatDateForForm(inspection.expiry_date)
  }));
};

/**
 * UTTS verilerini form yapısına uygun hale getirir
 */
const mapUtts = (utts: any[]) => {
  return utts.map(utt => ({
    ...utt,
    purchase_date: formatDateForForm(utt.purchase_date),
    installation_date: formatDateForForm(utt.installation_date)
  }));
};

/**
 * Form değerlerini API formatına dönüştürür (gönderim öncesi)
 */
export const transformFormToAPI = (formValues: any, relatedModules: any) => {
  // Form değerlerindeki tarihleri API formatına dönüştür
  const apiData = {
    ...formValues,
    invoice_date: formatDateForAPI(formValues.invoice_date)
  };
  
  // İlişkili modül verilerini API formatına dönüştür
  const apiRelatedModules = {
    insurances: mapInsurancesToAPI(relatedModules.insurances || []),
    inspections: mapInspectionsToAPI(relatedModules.inspections || []),
    utts: mapUttsToAPI(relatedModules.utts || []),
    hgs: relatedModules.hgs || []
  };
  
  return { data: apiData, included: apiRelatedModules };
};

// Diğer dönüşüm yardımcı fonksiyonları...
```

### Alan Adı Standartlaştırma

Tüm modüller için sabit alan adları tanımlanacak:

```typescript
// /src/features/vehicle/constants/field-names.ts
export const VEHICLE_FIELDS = {
  ID: "id",
  PLATE: "plate_number",
  BRAND: "brand_id",
  MODEL: "model_id",
  // ... diğer araç alanları
};

export const INSURANCE_FIELDS = {
  BASE: "insurances",
  ID: "id",
  VEHICLE_ID: "vehicle_id",
  TYPE: "insurance_type_id",
  COMPANY: "insurance_company_id",
  POLICY_NUMBER: "policy_number",
  TRAMER: "tramer",
  START_DATE: "start_date",
  END_DATE: "end_date",
  TOTAL_AMOUNT: "total_amount",
  CURRENCY: "currency_id", // Frontend'de currency_id, backend'de currency
  DESCRIPTION: "description",
  // ... diğer sigorta alanları
};

// Diğer modüller için benzer şekilde sabitler...
```

### Tarih İşleme Stratejisi

Tarih işleme için merkezi yardımcı fonksiyonlar:

```typescript
// /src/lib/date-utils.ts
/**
 * Tarih string'ini form için uygun formata çevirir (YYYY-MM-DD)
 */
export const formatDateForForm = (dateString: string | undefined): string | undefined => {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  } catch {
    return undefined;
  }
};

/**
 * Tarih string'ini API için uygun formata çevirir (ISO format)
 */
export const formatDateForAPI = (dateString: string | undefined): string | undefined => {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString();
  } catch {
    return undefined;
  }
};

/**
 * Tarih string'ini Türkçe gösterim için formatlama (DD.MM.YYYY)
 */
export const formatDateForDisplay = (dateString: string | undefined): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return "-";
  }
};
```

## Uygulama Adımları

1. **Yardımcı Dosyaların Oluşturulması**
   - `data-transformers.ts`
   - `field-names.ts`
   - `date-utils.ts`

2. **VehicleCreateProvider Entegrasyonu**
   ```typescript
   // VehicleCreateProvider.tsx içinde
   import { transformAPIResponse } from "../utils/data-transformers";
   
   // useVehicleEdit hook'u içinde
   const fetchVehicleData = async (id: number) => {
     try {
       // ...
       const response = await apiRequest(`api/vehicles/${id}/complete`);
       const { vehicleData, included } = transformAPIResponse(response);
       
       // Form değerlerini set et
       // ...
       
     } catch (error) {
       // ...
     }
   };
   ```

3. **Tab ve Form Bileşenlerinin Güncellenmesi**
   - Her tab için veri dönüşümü ve gösterimi
   - Form kontrolleri ve veri bağlama

## Modül Bazında Dönüşüm Şemaları

### Ana Araç Verileri

| Backend Alan | Frontend Alan | Tip | Açıklama |
|-------------|---------------|-----|----------|
| id | id | number | Araç ID |
| plate_number | plate_number | string | Plaka |
| brand_id | brand_id | number/string | Marka ID |
| model_id | model_id | number/string | Model ID |
| vehicle_type_id | vehicle_type_id | number/string | Araç Tipi ID |
| ... | ... | ... | ... |
| invoice_date | invoice_date | string | ISO -> YYYY-MM-DD |

### Sigorta Modülü

| Backend Alan | Frontend Alan | Tip | Açıklama |
|-------------|---------------|-----|----------|
| id | id | number | Sigorta ID |
| vehicle_id | vehicle_id | number | Araç ID |
| insurance_type_id | insurance_type_id | number/string | Sigorta Türü ID |
| start_date | start_date | string | ISO -> YYYY-MM-DD |
| end_date | end_date | string | ISO -> YYYY-MM-DD |
| currency | currency_id | string | Para birimi adı -> ID |
| ... | ... | ... | ... |

### Muayene Modülü

| Backend Alan | Frontend Alan | Tip | Açıklama |
|-------------|---------------|-----|----------|
| id | id | number | Muayene ID |
| vehicle_id | vehicle_id | number | Araç ID |
| inspection_date | inspection_date | string | ISO -> YYYY-MM-DD |
| expiry_date | expiry_date | string | ISO -> YYYY-MM-DD |
| ... | ... | ... | ... |

### UTTS Modülü

| Backend Alan | Frontend Alan | Tip | Açıklama |
|-------------|---------------|-----|----------|
| id | id | number | UTTS ID |
| vehicle_id | vehicle_id | number | Araç ID |
| purchase_date | purchase_date | string | ISO -> YYYY-MM-DD |
| installation_date | installation_date | string | ISO -> YYYY-MM-DD |
| utts_code | utts_code | string | UTTS Kodu |
| ... | ... | ... | ... |

### HGS Modülü

| Backend Alan | Frontend Alan | Tip | Açıklama |
|-------------|---------------|-----|----------|
| id | id | number | HGS ID |
| vehicle_id | vehicle_id | number | Araç ID |
| hgs_place | hgs_place | string | HGS Yeri |
| hgs_tag_no | hgs_tag_no | string | HGS Etiket No |
| hgs_vehicle_class | hgs_vehicle_class | string | HGS Araç Sınıfı |
| is_active | is_active | boolean | Aktif mi? |
| ... | ... | ... | ... |

## Test ve Doğrulama Planı

1. **Birim Testleri**
   - Veri dönüşüm fonksiyonlarının testleri
   - Tarih formatı dönüşüm testleri

2. **Entegrasyon Testleri**
   - VehicleCreateProvider ile dönüşüm katmanı entegrasyonu
   - Tab bileşenleri ve form dönüşümleri entegrasyonu

3. **UI Testleri**
   - Her tab'deki verilerin doğru gösterildiğinin kontrolü
   - Form değerlerinin doğru bağlandığının kontrolü

## Bakım ve Genişletme

1. **Yeni Alan Ekleme Süreci**
   - Sabit tanımlarına yeni alan ekleme
   - Dönüşüm fonksiyonlarını güncelleme
   - Form ve tab bileşenlerini güncelleme

2. **Sorun Giderme Stratejisi**
   - Veri akışı takibi için log noktaları
   - Alan eşleştirme hatalarını tespit için validation

3. **Dokümantasyon Güncellemesi**
   - Yeni alan ve modül eklemeleri için dokümantasyon güncelleme
   - Veri akış şemalarının güncel tutulması
