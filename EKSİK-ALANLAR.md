# Eksik Alanlar Listesi (Araç Kayıt Formu)

Aşağıdaki alanlar, backend'in zorunlu olarak beklediği ancak mevcut formda eksik olan veya gönderilmeyen alanlardır. Her birinin UI'da input/select olarak bulunması ve react-hook-form ile entegre olması gereklidir.

## Eksik/Zorunlu Alanlar

- plate_number (Plaka Numarası)
- branch_id (Şube ID)
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
- first_registration_date (İlk Tescil Tarihi)
- registration_document_number (Ruhsat Belge Numarası)
- vehicle_responsible_id (Araç Sorumlusu ID)
- vehicle_km (Araç KM)
- next_maintenance_date (Sonraki Bakım Tarihi)
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
branch_id (Şube ID)
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
first_registration_date (İlk Tescil Tarihi)

registration_document_number (Ruhsat Belge Numarası)
vehicle_responsible_id (Araç Sorumlusu ID)
vehicle_km (Araç KM)

next_maintenance_date (Sonraki Bakım Tarihi)
inspection_expiry_date (Muayene Bitiş Tarihi)
insurance_expiry_date (Trafik Sigorta Bitiş Tarihi)
casco_expiry_date (Kasko Bitiş Tarihi)
exhaust_stamp_expiry_date (Egzoz Pul Bitiş Tarihi)


Notlar
"package" alanı kodda "package_id" olarak geçiyor, bu doğru bir eşleşmedir.
Diğer alanlar için Controller ile controlled şekilde eklenmiş durumda.
Eksik alanlar genellikle tarih, kilometre ve sorumlu kişi gibi alanlardır.
