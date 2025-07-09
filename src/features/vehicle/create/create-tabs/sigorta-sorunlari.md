# Araç Sigorta Modülü Tutarsızlıkları

## Tespit Edilen Sorunlar

1. **Tarih Sıfırlanma Sorunu**
   - Dropdown listelerden (sigorta türü, şirket vb.) değer seçildiğinde tüm tarih alanları sıfırlanıyor
   - InsuranceForm.tsx dosyasında React Hook Form ile doğrudan DOM manipülasyonu birlikte kullanılıyor
   - React bileşenleri yeniden render edildiğinde setlenen tarih değerleri kayboluyor

2. **Paralel Veri Yönetimi**
   - InsuranceForm'da hem React Hook Form hem de doğrudan DOM manipülasyonu (`document.querySelector`) kullanılıyor
   - İki farklı veri yönetim yaklaşımı tutarsızlıklara ve öngörülemeyen davranışlara yol açıyor
   - Modern React yaklaşımlarına uygun olmayan anti-pattern'ler mevcut

3. **Devre Dışı Bırakılan UseEffect**
   - InsuranceForm.tsx dosyasında useEffect kısmı yorum satırına alınmış
   - Form validation hatalarını temizleme gibi önemli işlevler gerçekleştirilemiyor
   - Kod içinde "Bu bileşenle ilgili sorunlar olduğu için useEffect'i deaktif edelim" yorumu var

4. **Gecikme Kullanımı (setTimeout)**
   - useInsuranceFormHandler.ts dosyasında form değerlerini ayarlamak için 100ms'lik setTimeout kullanılıyor
   - Bu yaklaşım yarış koşullarına (race conditions) ve UI'da gecikmelere neden olabilir
   - React'in kendi state yönetim sistemi yerine imperatif kodlama yaklaşımı kullanılıyor

5. **Uyumsuz Tip İsimlendirmeleri**
   - InsuranceFormHandler'da `currency_id` alanı, InsuranceTable'da `currency` olarak kullanılıyor
   - Form alanları ve tablo alanları arasında tutarsız isimlendirmeler var
   - API yanıtları ile form/tablo modelleri arasında dönüşüm eksikliği

## Diğer Gözlemler

- Form validation için merkezi bir yaklaşım yerine farklı dosyalarda dağınık kontroller var
- InsuranceTable komponentinde type safety yerine `any` tiplerinin yaygın kullanımı
- Tarih manipülasyonu için farklı yerlerde farklı yaklaşımlar kullanılıyor
