# Sigorta Tab İyileştirme Planı

## 1. Genel Bakış

Araç sigorta kayıtlarının daha iyi yönetimi için mevcut InsuranceTab bileşeni, tablo + drawer form yapısına dönüştürülecek. Bu yapı, çok sayıda sigorta kaydı olduğunda bile ekran alanını verimli kullanacak ve kullanıcı deneyimini iyileştirecektir.

## 2. Temel Bileşenler ve Yapı

### 2.1 Ana Bileşenler

1. **Tablo Görünümü:** 
   - Mevcut sigorta kayıtlarını özet halinde listeler
   - Filtreleme ve sıralama özellikleri
   - Satır başına düzenleme/silme/yenileme işlemleri
   
2. **Drawer Form:**
   - Sağdan açılan geniş bir form paneli
   - Yeni kayıt ekleme ve mevcut kayıtları düzenleme için kullanılır
   - Sekmelere ayrılmış form alanları

3. **Boş Durum Gösterimi:**
   - Henüz sigorta kaydı yoksa bilgilendirici bir mesaj gösterir

### 2.2 Yapısal Akış

```
+------------------+         +----------------------------+
|                  |         |                            |
| Sigorta Tablosu  |         |                            |
|                  | ------> |       Drawer Form          |
| [+ Sigorta Ekle] |         |                            |
|                  |         |                            |
+------------------+         +----------------------------+
```

## 3. Tablo Tasarımı

Mevcut `@/components/ui/table` bileşenlerini kullanarak:

### 3.1 Sütun Yapısı

| Sigorta Türü | Poliçe Süresi         | Şirket         | Poliçe No | Tutar      | İşlemler                   |
|--------------|------------------------|----------------|-----------|------------|----------------------------|
| Kasko        | 01.01.2025 - 01.01.2026| Anadolu Sigorta| A12345    | 7.500 TL  | [Düzenle] [Yenile] [Sil]  |

### 3.2 Tablo Özellikleri

- **Durum Göstergeleri:** 
  - Yeşil: Aktif poliçe
  - Turuncu: 30 gün içinde sona erecek poliçe
  - Kırmızı: Süresi dolmuş poliçe
  
- **Sıralama Seçenekleri:**
  - Bitiş tarihine göre (varsayılan)
  - Sigorta türüne göre
  - Ödeme tutarına göre
  
- **Filtreleme Seçenekleri:**
  - Sigorta türüne göre
  - Aktif/pasif durumuna göre
  - Tarih aralığına göre

## 4. Drawer Form Tasarımı

### 4.1 Sekme Yapısı

1. **Temel Bilgiler Sekmesi**
   - Sigorta Türü (zorunlu)
   - Başlangıç Tarihi (zorunlu)
   - Poliçe Tarihi (zorunlu)
   - Bitiş Tarihi (zorunlu)
   - Sigorta Şirketi
   - Acenta

2. **Detaylar Sekmesi**
   - Poliçe No
   - Tramer
   - Acenta No
   - Açıklama

3. **Ödeme Sekmesi**
   - Tutar
   - Vergi Oranı (%)
   - Vergi Tutarı
   - Toplam Tutar
   - Para Birimi
   - Taksit Sayısı
   - Ödeme Türü
   - Ödeme Hesabı
   - Ödeme Kaydı Oluştur (checkbox)

### 4.2 Akıllı Form Özellikleri

- **Tarih Yardımcıları:** "Bugün", "+1 Yıl", "+6 Ay" gibi hızlı seçenekler
- **Otomatik Hesaplamalar:** Vergi tutarı, toplam tutar otomatik hesaplama
- **Veri Doğrulama:** Tarih doğrulama, zorunlu alan kontrolü

## 5. İşlevler

### 5.1 Temel İşlevler

- **Yeni Sigorta Kaydı Ekleme:**
  - "Sigorta Ekle" butonu ile drawer form açılır
  - Form doldurulup kaydedilir
  - Tablo güncellenir

- **Sigorta Kaydı Düzenleme:**
  - Tablodaki "Düzenle" butonu ile drawer form açılır
  - Mevcut veriler form alanlarına yüklenir
  - Değişiklikler yapılıp kaydedilir

- **Sigorta Kaydı Silme:**
  - Tablodaki "Sil" butonu ile onay sonrası kayıt silinir

### 5.2 İleri Seviye İşlevler

- **Poliçe Yenileme:**
  - "Yenile" butonu ile mevcut poliçe verileri kopyalanır
  - Tarihler otomatik güncellenir (bitiş tarihi +1 yıl vb.)
  - Yeni kayıt olarak drawer form açılır

- **Veri Hatırlama:**
  - Son kullanılan sigorta şirketi, acente gibi bilgiler hatırlanır
  - Yeni kayıtta önerilir

## 6. Uygulama Adımları

1. **InsuranceTab Bileşenini Güncelleme:**
   - State yönetimini ekleme (drawer durumu, düzenlenen kayıt indeksi)
   - Drawer bileşeni entegrasyonu
   
2. **Tablo Bileşeni Oluşturma:**
   - Sütun tanımları
   - Veri formatlaması
   - İşlem butonları
   
3. **Form Bileşeni Oluşturma:**
   - Sekmeli form yapısı
   - Alan grupları
   - Doğrulama kuralları
   
4. **İşlem Mantığı Ekleme:**
   - Kaydetme, düzenleme, silme işlevleri
   - Veri doğrulama ve hata kontrolü
   - Poliçe yenileme özelliği

## 7. Kullanılacak Bileşenler

1. **Mevcut Bileşenler:**
   - `@/components/ui/table` (DataTable, vb.)
   - `@/components/ui/form-input`, `@/components/ui/form-select`
   - `@/components/ui/button`
   - `@/components/ui/card`

2. **Eklenecek Yeni Bileşenler:**
   - `@/components/ui/drawer` (sağdan açılan panel)
   - `@/components/ui/tabs` (form sekmeleri için)
   - `@/components/ui/badge` (durum göstergeleri için)

## 8. Veri Yapısı (Mevcut)

```typescript
interface InsuranceRecord {
  insurance_type_id: number;
  start_date: string;
  policy_date: string;
  end_date: string;
  insurance_company_id?: number;
  agency_id?: number;
  policy_number?: string;
  tramer?: string;
  agency_number?: string;
  amount?: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount?: number;
  currency?: string;
  installment_count?: number;
  payment_type_id?: number;
  payment_account_id?: number;
  create_payment_record?: boolean;
  description?: string;
}
```

## 9. Gelecek Geliştirmeler

- Sigorta poliçe belgesi yükleme özelliği
- Eksik bilgilerin tamamlanması için hatırlatma sistemi
- Yenileme zamanı yaklaşan poliçeler için bildirim mekanizması
- Sigorta maliyetleri analiz raporu
