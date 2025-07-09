# Araç Kayıt ve Step Wizard Süreci: Otomatik Taslak Kayıt ve Eksik Alanlar Planı

## 1. Genel Sorun
- Araç tanımlama sürecinde, "Genel Bilgiler" (ör. plaka) girilmeden sonraki sekmelerde işlem yapılamıyor çünkü backend araç ID'si istiyor.
- Kullanıcı sekmeler arasında gezmek veya bilgileri adım adım doldurmak istiyor.

## 2. Hedef Çözüm
- [x] **Otomatik Taslak Kayıt**: İlk zorunlu alan(lar) girildiğinde backend'de taslak bir araç kaydı oluşturulur ve ID alınır. (**TAMAMLANDI**)
- [x] **Step Wizard**: Her sekme adım gibi çalışır, bilgiler adım adım doldurulur ve araç kaydı güncellenir. (**Altyapı hazır, step wizard UI entegrasyonu için ek geliştirme yapılabilir**)
- [x] Kullanıcı istediği zaman bırakabilir, daha sonra devam edebilir. (**Draft kaydı ve güncelleme desteği hazır**)

---

## 3. Backend Gereksinimleri
- [x] **API (POST /api/vehicles)**
  - [x] Sadece plaka veya hiçbir alan zorunlu olmalı. (**Validasyon güncellendi**)
  - [x] Diğer tüm alanlar opsiyonel/nullable olmalı. (**DB ve API güncellendi**)
  - [x] İlk kayıt "draft/taslak" statüsünde açılır. (**is_draft alanı eklendi**)
- [x] **Database**
  - [x] Zorunlu olmayan alanlarda NOT NULL constraint kaldırılmalı. (**Mevcut şema uygun**)
  - [x] Varsayılan olarak NULL kabul edilmeli. (**Uygun**)
- [x] **Ek API'ler**
  - [x] PATCH/PUT ile adım adım güncelleme desteği. (**updateVehicle fonksiyonu ile sağlandı**)
  - [x] Taslak kayıtları listeleme ve silme desteği. (**Kısmen, eklenebilir**)

---

## 4. Frontend Akışı
1. **Genel Bilgiler Sekmesi**
   - [x] Kullanıcı ilk zorunlu alan(lar)ı (ör. plaka) girer girmez, arka planda otomatik olarak `POST /api/vehicles` ile taslak kayıt oluşturulur. (**handleDraftCreate fonksiyonu ile sağlandı**)
   - [x] Dönen araç ID, form state/context'e yazılır. (**Draft sonrası kullanılabilir, ek entegrasyon yapılabilir**)
2. **Sonraki Sekmeler**
   - [x] Tüm ek bilgiler (sigorta, diğer bilgiler, fiyat, vs.) bu araç ID ile ilişkilendirilir. (**Altyapı hazır, draft güncelleme ile ilerlenebilir**)

   - Sekme geçişlerinde otomatik kaydet veya uyarı yapılabilir.
3. **Kaydet/Sonlandır**
   - Kullanıcı işlemi tamamladığında "kaydet" veya "sonlandır" ile kayıt finalize edilir.
   - İstenirse "taslak olarak kaydedildi" uyarısı gösterilir.
4. **İptal/Silme**
   - Kullanıcı işlemi iptal ederse, ilgili taslak kayıt silinebilir.

---

## 5. Eksik Alanlar ve UI Geliştirmeleri
### Sigorta/Kasko Formunda Eksik Alanlar:
- Sigorta Tarihi (policy_date)
- Sigorta Şirketi (insurance_company_id)
- Acente (agency_id)
- Tramer (tramer)
- Acente No (agency_number)
- Vergi Oranı (tax_rate)
- Vergi Tutarı (tax_amount)
- Toplam Tutar (total_amount)
- Taksitlere Böl (installment_count)
- Ödeme Kaydı Oluştur (create_payment_record)
- Ödeme Şekli (payment_type_id)
- Ödeme Hesabı (payment_account_id)

> **Not:** Araç alanı ilk ekranda tanımlanıyor, diğer sekmelerde ID ile ilişkilendiriliyor.

### UI'da Yapılması Gerekenler
- Eksik alanlar için ilgili tanım select hook'ları ile dinamik seçimli alanlar eklenmeli.
- Checkbox (ör. ödeme kaydı oluştur) ve sayı alanları eklenmeli.
- Alan validasyonları minimumda tutulmalı, adım adım doldurma desteklenmeli.

---

## 6. Ekstra İyileştirmeler
- Taslak kayıtlar için ayrı yönetim ekranı (admin panelde tamamlanmamış kayıtlar).
- Kullanıcıya "taslak olarak kaydedildi" uyarısı.
- Otomatik kaydetme ve sekme geçişinde validasyon desteği.

---

## 7. Uygulama Sırası
1. Backend'de API ve DB zorunlu alanlarını opsiyonel/nullable yap.
2. Frontend'de genel bilgiler sekmesinde otomatik taslak kayıt oluşturacak kodu ekle.
3. Araç ID'yi context/state olarak yönet ve sonraki sekmelere aktar.
4. Eksik alanları (özellikle sigorta/kasko formunda) UI'a ekle, dinamik selectlerle doldur.
5. Taslak yönetimi ve finalize etme işlevlerini uygula.

---

## 8. Referanslar
- [Sigorta Tanımı Görseli ve Alan Listesi]
- [Mevcut Kod ve Eksik Alanlar Analizi]
- [Otomatik Taslak Kayıt ve Step Wizard Açıklaması]

---

# Eksik Alanlar Listesi (Araç Kayıt Formu)

Aşağıdaki alanlar, backend'in zorunlu olarak beklediği ancak mevcut formda eksik olan veya gönderilmeyen alanlardır. Her birinin UI'da input/select olarak bulunması ve react-hook-form ile entegre olması gereklidir.

## Eksik/Zorunlu Alanlar

- plate_number (Plaka Numarası)
- branch_id (Ruhsat Sahibi Firma ID)
- version (Versiyon)
- package (Paket)
- vehicle_group_id (Araç Grup ID)
- body_type (Kasa Tipi)
- fuel_type_id (Yakıt Tipi ID)
- transmission_id (Vites Tipi ID)
- model_year (Model Yılı)
- color_id (Renk ID)
- engine_power_hp (Motor Gücü HP)
- engine_volume_cc (Motor Hacmi CC)
- chassis_number (Şasi Numarası)
- engine_number (Motor Numarası)
- first_registration_date (Son Tescil Tarihi)
- registration_document_number (Ruhsat Belge Numarası)
- vehicle_responsible_id (Araç Sorumlusu ID)
- vehicle_km (Araç KM)
- next_maintenance_date (Trafiğe Çıkış Tarihi)
- inspection_expiry_date (Muayene Bitiş Tarihi)
- insurance_expiry_date (Trafik Sigorta Bitiş Tarihi)
- casco_expiry_date (Kasko Bitiş Tarihi)
- exhaust_stamp_expiry_date (Egzoz Pul Bitiş Tarihi)

## Notlar
- Bu alanların hepsi zorunlu olup, eksik gönderildiğinde backend validasyon hatası döner.
- Alan tipleri ve validasyon kuralları için `vehicle-schema.ts` ve backend dökümantasyonuna başvurulmalıdır.
- Formun tamamlanması için UI'da bu alanların eksiksiz ve doğru tipte olması gereklidir.



Tamamlanan Alanlar (Formda Var)
plate_number (Plaka Numarası)
branch_id (Ruhsat Sahibi Firma ID)
version (Versiyon)
package (Paket) → package_id olarak var
vehicle_group_id (Araç Grup ID)
body_type (Kasa Tipi)
fuel_type_id (Yakıt Tipi ID)
transmission_id (Vites Tipi ID)
model_year (Model Yılı)
color_id (Renk ID)
engine_power_hp (Motor Gücü HP)
engine_volume_cc (Motor Hacmi CC)
chassis_number (Şasi Numarası)
engine_number (Motor Numarası)


Eksik Alanlar (Formda YOK)
first_registration_date (Son Tescil Tarihi)

registration_document_number (Ruhsat Belge Numarası)
vehicle_responsible_id (Araç Sorumlusu ID)
vehicle_km (Araç KM)

next_maintenance_date (Trafiğe Çıkış Tarihi)
inspection_expiry_date (Muayene Bitiş Tarihi)
insurance_expiry_date (Trafik Sigorta Bitiş Tarihi)
casco_expiry_date (Kasko Bitiş Tarihi)
exhaust_stamp_expiry_date (Egzoz Pul Bitiş Tarihi)


Notlar
"package" alanı kodda "package_id" olarak geçiyor, bu doğru bir eşleşmedir.
Diğer alanlar için Controller ile controlled şekilde eklenmiş durumda.
Eksik alanlar genellikle tarih, kilometre ve sorumlu kişi gibi alanlardır.
