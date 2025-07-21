# Araç Modülü Veri Akış Dokümantasyonu

Bu doküman, Araç modülünü oluşturan alt modüller (insurance, inspection, hgs, utts) için veri akışını ve alan eşleşmelerini açıklar.

## Genel Veri Akış Mimarisi

```
API Response --> data-transformers.ts --> Form Values --> UI Components
     ^                                       |
     |                                       v
     +---------- API Request <------- Form Submission
```

1. **Backend API'dan Veri Alma**: `/api/vehicles/[id]/complete` endpoint'inden gelen veri
2. **Veri Dönüşümü**: `transformAPIResponse()` fonksiyonu ile API verisi frontend form formatına dönüştürülür
3. **Form Değerleri**: Dönüştürülmüş veriler form'a yüklenir (`form.reset()`)
4. **UI Bileşenleri**: Form değerlerini UI bileşenleri gösterir
5. **Form Gönderimi**: Kullanıcı değişiklik yaptığında, veriler tekrar API formatına dönüştürülüp gönderilir

## Merkezi Veri Dönüşüm Katmanı

`data-transformers.ts` dosyası, tüm modül için tutarlı bir veri dönüşüm katmanı sağlar:

- `transformAPIResponse()`: Ana dönüşüm fonksiyonu
- `mapInsurances()`, `mapInspections()`, `mapUtts()`, `mapHgs()`: Modül-spesifik dönüşüm fonksiyonları

## Sigorta Modülü (Insurance)

### Alan Eşleşmeleri

| API Alanı | Frontend Alanı | Format | Dönüşüm İşlemi |
|-----------|---------------|--------|----------------|
| id | id | number | Doğrudan |
| vehicle_id | vehicle_id | number | Doğrudan |
| insurance_type_id | insurance_type_id | number | Doğrudan |
| insurance_company_id | insurance_company_id | number | Doğrudan |
| policy_number | policy_number | string | Doğrudan |
| tramer | tramer | string | Doğrudan |
| start_date | start_date | string (YYYY-MM-DD) | `formatDateForForm()` |
| end_date | end_date | string (YYYY-MM-DD) | `formatDateForForm()` |
| total_amount | total_amount | string | Doğrudan |
| currency_id | currency_id | string | Doğrudan |
| description | description | string | Doğrudan |

### Veri Binding Zinciri

1. API Yanıtı → `transformAPIResponse()` → `mapInsurances()`
2. `useVehicleEdit` veya `VehicleCreateProvider` → `setInsurances()`
3. `InsuranceTab` → `useVehicleForm().insurances`
4. UI Form Alanları → `useInsuranceFormHandler`

## Muayene Modülü (Inspection)

### Alan Eşleşmeleri

| API Alanı | Frontend Alanı | Format | Dönüşüm İşlemi |
|-----------|---------------|--------|----------------|
| id | id | number | Doğrudan |
| vehicle_id | vehicle_id | number | Doğrudan |
| inspection_date | inspection_date | string (YYYY-MM-DD) | `formatDateForForm()` |
| expiry_date | expiry_date | string (YYYY-MM-DD) | `formatDateForForm()` |

### Veri Binding Zinciri

1. API Yanıtı → `transformAPIResponse()` → `mapInspections()`
2. `useVehicleEdit` veya `VehicleCreateProvider` → `setInspections()`
3. `InspectionTab` → `useVehicleForm().inspections`
4. UI Form Alanları

## HGS Modülü

### Alan Eşleşmeleri

| API Alanı | Frontend Alanı | Format | Dönüşüm İşlemi |
|-----------|---------------|--------|----------------|
| id | id | number | Doğrudan |
| vehicle_id | vehicle_id | number | Doğrudan |
| hgs_place | hgs_place | string | Doğrudan |
| hgs_tag_no | hgs_tag_no | string | Doğrudan |
| hgs_vehicle_class | hgs_vehicle_class | string | Doğrudan |
| is_active | is_active | boolean | String to Boolean |

### Veri Binding Zinciri

1. API Yanıtı → `transformAPIResponse()` → `mapHgs()`
2. `useVehicleEdit` veya `VehicleCreateProvider` → `setHgs()`
3. `BasicTab` → `useVehicleForm().hgs`
4. UI Form Alanları (`hgsList.0.X` alanları)

## UTTS Modülü

### Alan Eşleşmeleri

| API Alanı | Frontend Alanı | Format | Dönüşüm İşlemi |
|-----------|---------------|--------|----------------|
| id | id | number | Doğrudan |
| vehicle_id | vehicle_id | number | Doğrudan |
| purchase_date | purchase_date | string (YYYY-MM-DD) | `formatDateForForm()` |
| installation_date | installation_date | string (YYYY-MM-DD) | `formatDateForForm()` |
| utts_code | utts_code | string | Doğrudan |

### Veri Binding Zinciri

1. API Yanıtı → `transformAPIResponse()` → `mapUtts()`
2. `useVehicleEdit` veya `VehicleCreateProvider` → `setUtts()`
3. `UTTSTab` → `useVehicleForm().utts`
4. UI Form Alanları

## Tarih Formatları

Proje genelinde tarih formatları:

- **API Formatı**: `YYYY-MM-DD` (ISO-8601 formatı)
- **Form Formatı**: `YYYY-MM-DD` (Form içinde saklanan format)
- **Görüntüleme Formatı**: `DD.MM.YYYY` (Kullanıcıya gösterilen format)

Bu formatlar arasındaki dönüşüm, merkezi `date-utils.ts` dosyasındaki yardımcı fonksiyonlar kullanılarak yapılır:

- `formatDateForAPI`: Form değerini API formatına dönüştürür
- `formatDateForForm`: API değerini form formatına dönüştürür
- `formatDateForDisplay`: Form değerini görüntüleme formatına dönüştürür

## Veri Akış Kontrolü

Veri akışının düzgün çalışması için şunlar kontrol edilmelidir:

1. Form reset işlemi sonrası tüm alanlar doğru doldurulmuş mu?
2. Tarih formatları tüm modüllerde tutarlı mı?
3. İlişkili modül verilerinin tamamı doğru aktarılıyor mu?
4. Formda yapılan değişiklikler submit sonrası kaydediliyor mu?
5. API yanıtı hataları uygun şekilde ele alınıyor mu?

Bu dokümantasyon, araç modülü verileri için merkezi bir referans olarak kullanılabilir ve gelecekteki bakım/geliştirme çalışmalarında yol gösterici olacaktır.
