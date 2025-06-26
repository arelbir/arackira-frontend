# React Query'ye Tam Geçiş Planı

## Faz 1: Envanter ve Analiz (1 Hafta)

1. **Durum Tespiti**
   - Tüm eski servis dosyalarını listeleyip durumunu çıkar (`*Service.ts` formatındakiler)
   - Modern servis dosyalarını belirle (`*-service.ts` formatındakiler)
   - Hangi bileşenlerin hangi servis dosyalarını kullandığını belirle (bağımlılık analizi)
   - Yüksek öncelikli/sık kullanılan modülleri tespit et

2. **Riskli Bölgeler Tespiti**
   - Karmaşık iş mantığı içeren bileşenleri belirle
   - Özel durum yönetimi olan servis çağrılarını tespit et
   - Manuel veri önbelleği/state yönetimi yapan kodları belirle

## Faz 2: Pilot Modüller Genişletme (2 Hafta)

1. **Hazırlık**
   - Mevcut React Query modüllerinden şablon çıkar (models, vehicle-types gibi)
   - Pilot sonrası ders çıkarımlarını ve best practice'leri dokümante et
   - Geçiş için test ortamı oluştur

2. **Öncelikli Modüller**
   - 4-5 önemli modülü seç (`brands`, `clients`, `reservations` gibi)
   - Bu modüller için yeni servis dosyaları oluştur (`*-service.ts`)
   - React Query hook'ları oluştur (`use-*.ts`)
   - İlgili bileşenleri yeni hook'ları kullanacak şekilde güncelle
   - Ünite test ve entegrasyon testi ekle

## Faz 3: Orta Öncelikli Modüller (3 Hafta)

1. **Temizlik ve Ölçeklendirme**
   - Pilot modüllerdeki eski servis dosyalarını kaldır
   - Kalan modülleri öncelik sırasına göre listele
   - Standart şablonlarla dönüşüm sürecini ölçeklendirmeye hazırla
   
2. **Orta Öncelikli Modüller**
   - Her hafta 5-7 modülü dönüştür (15-20 modül toplam)
   - Her bir modül için:
     - Modern servis dosyası oluştur
     - React Query hook'ları oluştur
     - Bağımlı bileşenleri güncelle
     - Testlerle doğrula
   - Her modül tamamlandığında eski dosyayı kaldır

## Faz 4: Düşük Öncelikli Modüller ve Optimizasyon (2 Hafta)

1. **Kalan Modüller**
   - Az kullanılan/düşük öncelikli modülleri dönüştür
   - Tüm eski servis dosyalarını kaldır
   - Tüm `apiFetch` kullanımlarını `apiRequest` ile değiştir

2. **Sistem Genelinde Optimizasyonlar**
   - Optimistik güncellemeleri tüm modüllere yay
   - Prefetching stratejilerini tüm listelemelerle entegre et
   - Suspense ve Error Boundary kullanımını standartlaştır

## Faz 5: Entegrasyon ve Son Kontroller (1 Hafta)

1. **Kapsamlı Testler**
   - Uçtan uca testler ekle
   - Performans kritik noktalarını ölç ve optimize et
   - Dokümantasyonu güncelle

2. **Tam Geçiş**
   - Son kalan kalıntıları temizle
   - Query devtools yapılandırmasını kontrol et
   - Proje yapılandırmasını gözden geçir (örn: ESLint kuralları)
   - Ekibe eğitim ver

## Süreç İlkeleri

1. **Kademeli Geçiş**
   - Her zaman geriye dönük uyumluluk sağla
   - Bir seferde tek bir modülü değiştir
   - Her değişiklikten sonra temel testleri çalıştır

2. **Yeni İş + Refaktörleme Dengesi**
   - Her sprint'te hem yeni iş hem de refaktörleme planla
   - Refaktörleme işlerini yeni özelliklerle ilişkilendir

3. **Dokümantasyon**
   - Değişikliklerin etkisini kaydet
   - Sorunlarla başa çıkma yöntemlerini dokümante et
   - Ekibin geri bildirimini düzenli olarak topla

4. **Test**
   - Her modül değişikliği için test senaryoları oluştur
   - Kritik iş yollarını otomasyon testleriyle koru

## Çıktı Tablosu

| Hafta | Ana Hedefler | Modüller | Çıktılar |
|-------|--------------|---------:|----------|
| 1 | Envanter ve Analiz | Tümü | Geçiş stratejisi dokümanı |
| 2-3 | Pilot Genişletme | 4-5 | Pilot modül geçişleri + şablon |
| 4-6 | Orta Öncelikli | 15-20 | Tüm ana modüller dönüşmüş |
| 7-8 | Düşük Öncelikli | Kalan | Tüm eski dosyalar kaldırılmış |
| 9 | Entegrasyon | - | Tam geçiş tamamlanmış |

## Mevcut Durum

### Modernize Edilmiş Modüller (Modern API)
- Vehicle Types (`vehicle-type-service.ts`)
- Vehicle Statuses (`vehicle-status-service.ts`)
- Transmissions (`transmission-service.ts`)
- Fuel Types (`fuel-type-service.ts`)
- Models (`model-service.ts`)
- Brands (`brand-service.ts`)
- Colors (`color-service.ts`)
- Packages (`package-service.ts`)

### Modernize Edilecek Modüller (Eski API)
- Agencies (`agencyService.ts`)
- Branches (`branchService.ts`)
- Client Types (`clientTypeService.ts`)
- Currencies (`currencyService.ts`)
- Insurance Companies (`insuranceCompanyService.ts`)
- Insurance Types (`insuranceTypeService.ts`)
- Payment Accounts (`paymentAccountService.ts`)
- Payment Types (`paymentTypeService.ts`) 
- Service Companies (`serviceCompanyService.ts`)
- Service Types (`serviceTypeService.ts`)
- Supplier Categories (`supplierCategoryService.ts`)
- Suppliers (`supplierService.ts`)
- Tire Brands (`tireBrandService.ts`)
- Tire Conditions (`tireConditionService.ts`)
- Tire Models (`tireModelService.ts`)
- Tire Positions (`tirePositionService.ts`)
- Tire Types (`tireTypeService.ts`)
- Tyre Suppliers (`tyreSupplierService.ts`)

Bu plan, sistemdeki mevcut durum analizi ve gözlemlerine göre hazırlanmıştır. Geçiş sürecini 9 haftada tamamlamayı hedeflemektedir.
