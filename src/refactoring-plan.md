# Definition Modules Refactoring Plan

Bu belge, `models` modülünde uygulanan refactoring deseninin diğer tanım modüllerine uygulanması için kapsamlı bir plan sunmaktadır. Çalışma, silme onayı için yerel `window.confirm` kullanımını daha tutarlı ve yeniden kullanılabilir bir UI bileşeniyle değiştirmeye odaklanmaktadır.

## Mevcut Modeller Modülü İncelemesi

`models` modülü, DRY (Don't Repeat Yourself) prensibine göre yapılandırılmış, iyi tasarlanmış bir yapıya sahiptir:

### Önemli Bileşenler

1. **Özellikler Dizin Yapısı:**
   - `model-schema.ts` - TypeScript arayüzünü ve Zod doğrulama şemasını tanımlar
   - `model-service.ts` - API servisleri için fabrika desenini kullanır
   - `use-models.ts` - Veri alma ve mutasyon için özel hook'lar
   - `components.tsx` - Fabrika desenleriyle yeniden kullanılabilir UI bileşenleri

2. **Sayfa Uygulaması:**
   - Sayfa, özelliklerden hook'ları ve bileşenleri tüketir
   - Silme onayı için paylaşılan dialog bileşenini kullanır
   - Modal, düzenleme ve silme durumlarını yerel olarak yönetir

3. **Silme Onayı Deseni:**
   - `createDeleteConfirmDialog` fabrika fonksiyonuyla tipe özgü dialog bileşeni oluşturur
   - Dialog durumunu sayfa bileşeninde yönetir
   - Öğe, yükleme durumu ve geri çağrıları dialog'a aktarır

## Modülleri Yeniden Düzenleme Planı

Bu analiz temelinde, modülleri şu sırayla yeniden düzenlemeyi öneriyoruz:

### 1. Aşama: Temel Araç Modülleri

#### 1. Markalar (Brands)
- Yüksek öncelikli ve basit yapı
- `BrandDeleteConfirmDialog` oluştur
- Onay dialovu kullanmak için sayfayı güncelle
- Silme iş akışını test et

#### 2. Renkler (Colors)
- Ayrıca basit ve sık kullanılır
- `ColorDeleteConfirmDialog` oluştur
- Yeniden kullanılabilir bileşeni kullanmak için sayfayı güncelle

### 2. Aşama: Araç Yapılandırma Modülleri

#### 3. Yakıt Türleri (Fuel Types)
- `FuelTypeDeleteConfirmDialog` oluştur
- Silme aksiyonlarını diyalog bazlı hale getir

#### 4. Şanzımanlar (Transmissions)
- `TransmissionDeleteConfirmDialog` oluştur
- Silme modunu güncelleyerek test et

#### 5. Araç Tipleri (Vehicle Types)
- `VehicleTypeDeleteConfirmDialog` oluştur
- Sayfa bileşenini entegre et

#### 6. Araç Durumları (Vehicle Statuses)
- `VehicleStatusDeleteConfirmDialog` oluştur
- Silme işlemlerini diyalog bazlı hale çevir

### 3. Aşama: Finansal Modüller

#### 7. Ödeme Türleri (Payment Types)
- `PaymentTypeDeleteConfirmDialog` oluştur
- Sayfa akışını güncelleyerek test et

#### 8. Para Birimleri (Currencies)
- `CurrencyDeleteConfirmDialog` oluştur
- Sayfa davranışını güncelle

#### 9. Ödeme Hesapları (Payment Accounts)
- `PaymentAccountDeleteConfirmDialog` oluştur
- Dialog bazlı silme işlemlerini uygula

### 4. Aşama: Servis İlişkili Modüller

#### 10. Tedarikçiler (Suppliers)
- `SupplierDeleteConfirmDialog` oluştur
- Onay mekanizmasını güncelle

#### 11. Servis Türleri (Service Types)
- `ServiceTypeDeleteConfirmDialog` oluştur
- Silme işlemlerini iyileştir

#### 12. Servis Şirketleri (Service Companies)
- `ServiceCompanyDeleteConfirmDialog` oluştur
- Sayfa mantığını güncelle

### 5. Aşama: Lastik İlişkili Modüller

#### 13. Lastik Markaları (Tire Brands)
- `TireBrandDeleteConfirmDialog` oluştur
- Onay mantığını entegre et 

#### 14. Lastik Modelleri (Tire Models)
- `TireModelDeleteConfirmDialog` oluştur
- Dialog bazlı silme işlemlerini uygula

#### 15. Lastik Tipleri (Tire Types)
- `TireTypeDeleteConfirmDialog` oluştur
- Silme iş akışını iyileştir

#### 16. Lastik Konumları (Tire Positions)
- `TirePositionDeleteConfirmDialog` oluştur
- Onay diyalogunu entegre et

#### 17. Lastik Durumları (Tire Conditions)
- `TireConditionDeleteConfirmDialog` oluştur
- Silme onayı diyalogunu uygula

### 6. Aşama: Kalan Modüller

#### 18. Sigorta Türleri (Insurance Types)
- `InsuranceTypeDeleteConfirmDialog` oluştur
- Sayfa mantığını güncelle

#### 19. Sigorta Şirketleri (Insurance Companies)
- `InsuranceCompanyDeleteConfirmDialog` oluştur
- Silme işlemlerini dialog bazlı hale getir

#### 20. Acenteler (Agencies)
- `AgencyDeleteConfirmDialog` oluştur
- Dialog entegrasyonu ekle

#### 21. Şubeler (Branches)
- `BranchDeleteConfirmDialog` oluştur
- Silme onayını güncelleyerek test et

#### 22. Müşteri Tipleri (Client Types)
- `ClientTypeDeleteConfirmDialog` oluştur
- Dialog entegrasyonu ekle

#### 23. Paketler (Packages)
- `PackageDeleteConfirmDialog` oluştur
- Onay diyalogunu entegre et

#### 24. Tedarikçi Kategorileri (Supplier Categories)
- `SupplierCategoryDeleteConfirmDialog` oluştur
- Silme onayını dialog bazlı hale çevir

#### 25. Lastik Tedarikçileri (Tyre Suppliers)
- `TyreSupplierDeleteConfirmDialog` oluştur
- Onay diyalogunu entegre et

## Her Modül İçin Uygulama Adımları

Her modül için şunları yapmamız gerekecek:

1. **Bileşen Yapısını Kontrol Et:**
   - Mevcut modül bileşenlerinin örüntüyü takip ettiğini doğrula
   - DeleteConfirmDialog bileşenini güncelle veya oluştur

2. **Sayfa Bileşenini Güncelle:**
   - Dialog kontrolü için durum ekle (open, itemToDelete)
   - window.confirm'i dialog bileşeniyle değiştir
   - İşleyici fonksiyonlarını güncelle

3. **İşlevselliği Test Et:**
   - UI tutarlılığını doğrula
   - Silme işlemini test et
   - API yanıt işlemeyi onayla
   - 204 No Content için JSON parse hatası olmadığını doğrula

## Zaman Çizelgesi ve Öncelikler

- **Yüksek Öncelik:** Brands, Colors (Temel modüller)
- **Orta Öncelik:** Fuel Types, Transmissions, Vehicle Types (Araç özellikleri)
- **Normal Öncelik:** Ödeme ve servis modülleri
- **Düşük Öncelik:** Daha az kullanılan ve özel modüller

## Sonraki Adım

İlk modül olarak **Brands** modülüyle başlayarak, `createDeleteConfirmDialog` kullanımını uygulayacağız ve callback entegrasyonu yaklaşımını test edeceğiz. Başarılı olursa, diğer modüllere aynı yaklaşımı uygulayarak devam edeceğiz.
