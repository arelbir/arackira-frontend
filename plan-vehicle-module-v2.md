# Araç Modülü V2 – Yeni Mimari ve Geliştirme Planı

## Amaç
Backend ile tam uyumlu, sürdürülebilir, modüler ve detaylı veri girişine uygun bir araç modülü geliştirmek.

---

## 1. Temel İlkeler ve Hedefler
- Form ve detay ekranları, alan gruplarına (sekme veya accordion) ayrılacak.
- Her alan grubu kendi componentinde olacak (ör: Genel Bilgiler, Resmi Bilgiler, Haklama Bilgileri).
- Tekrar eden input/select alanları için ortak ve otomatik validasyonlu field componentleri kullanılacak.
- Kodda ve UI’da sade, okunabilir, kolay genişletilebilir yapı hedeflenecek.

---

## 2. Dosya ve Component Yapısı (Önerilen)

```
/features/vehicle/
  form/
    VehicleForm.tsx              # Formun ana çatı componenti
    GeneralInfoSection.tsx       # Genel bilgiler (plaka, marka, model, yıl, renk, şube, tip, vites, yakıt...)
    OfficialInfoSection.tsx      # Resmi bilgiler (şasi no, motor no, ruhsat, tescil tarihi, belge no...)
    OwnershipInfoSection.tsx     # Haklama/sorumluluk (sorumlu, müşteri, km, bakım, sigorta, muayene...)
    FormSelectField.tsx          # Ortak selectbox alanı
    FormInputField.tsx           # Ortak input alanı
    FormDateField.tsx            # Ortak tarih alanı
  list/
    VehicleList.tsx              # Araçların listesi
    VehicleTable.tsx             # Tablo yapısı ve başlıklar
    VehicleTableRow.tsx          # Tekil satır componenti
  detail/
    VehicleDetailModal.tsx       # Detay modalı
  schema/
    vehicle-schema.ts            # Zod validasyon şeması
    vehicle-types.ts             # Tip tanımları
  service/
    vehicleService.ts            # API servis fonksiyonları
  hooks/
    useVehicleForm.ts            # Form state ve iş mantığı
    useVehicleDefinitions.ts     # Tanım verilerini çekme mantığı
```

---

## 3. Form Alan Grupları ve İçerikleri

### Genel Bilgiler
- Plaka, Şube, Cins, Marka, Model, Versiyon, Paket, Grup, Kasa Tipi, Yakıt, Vites, Model Yılı, Renk, Motor Gücü (hp), Motor Hacmi (cc)

### Resmi Bilgiler
- Şasi No, Motor No, İlk Tescil Tarihi, Ruhsat Belge No, Satın Alma Tarihi, Satın Alma Maliyeti

### Haklama ve Bakım Bilgileri
- Araç Sorumlusu, Müşteri, KM, Sonraki Bakım Tarihi, Muayene Bitiş, Sigorta Bitiş, Kasko Bitiş, Egzoz Pulu Bitiş

### Diğer Bilgiler
- Notlar, Durum, Ek alanlar (gerekirse)

---

## 4. Teknik Standartlar ve Geliştirme Kuralları
- Her alan grubu ve field ortak component olmalı.
- Form state yönetimi ve veri çekme mantığı ayrılmalı (custom hook/context).
- UI’da sekmeli veya gruplu yapı uygulanmalı.
- Tip ve validasyon tek merkezden yönetilmeli.
- ProtectedRoute ile erişim ve rol kontrolü zorunlu.
- Kodlar max 100-150 satır/component olacak şekilde bölünmeli.

---

## 5. Yol Haritası ve Aksiyonlar
1. Yeni dosya ve component iskeletlerini oluştur.
2. Form alanlarını yukarıdaki gruplara göre componentlere böl.
3. Ortak field componentlerini hazırla ve tüm alanlarda kullan.
4. Custom hook ve servis fonksiyonlarını modüler yaz.
5. Liste ve detay ekranlarını sadeleştir, reusable hale getir.
6. Gerekirse backend ile toplu veri/ilişkili tanımlar için endpoint planla.
7. Sonraki sprintte toplu yükleme/import özelliği ekle.

---

## Notlar
- Backend ile birebir uyum ve validasyon zorunlu.
- Kullanıcı deneyimi ve hata yönetimi öncelikli.
- Kodlar ekip standartlarına ve sürdürülebilir mimariye uygun olacak.
