# Tanım Modülleri CRUD Geliştirme Planı

Bu doküman, araç yönetimi için gerekli tüm tanım modüllerinin ("definitions") frontend CRUD ekranlarının geliştirilme planını içerir. Her modül için temel gereksinimler ve iş akışları aşağıda detaylandırılmıştır.

---

## Ortak Hedefler
- Her tanım için (renk, marka, model, müşteri tipi, yakıt tipi, vites tipi, vs.) sade ve tekrar kullanılabilir CRUD ekranları oluşturulacak.
- Tüm tanımlar için ortak bir "Tanımlar" menüsü/dashboard olacak.
- Her modül için: listeleme, ekleme, düzenleme, silme ve tercihen toplu yükleme/import desteği sağlanacak.
- Tanımlar arası ilişkiler (örn. marka → model) canlı olarak uygulanacak.
- API ile veri çekme/güncelleme ve kullanıcı dostu hata mesajları standart olacak.

---

## Modül Listesi ve Yapılacaklar

### 1. Renkler (Colors)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 2. Markalar (Brands)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 3. Modeller (Models)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Marka seçimine göre filtreleme (ilişkili seçim kutusu)
- [ ] Toplu yükleme/import

### 4. Müşteri Tipleri (Client Types)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 5. Yakıt Tipleri (Fuel Types)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 6. Vites Tipleri (Transmissions)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 7. Araç Tipleri (Vehicle Types)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 8. Sigorta Şirketleri (Insurance Companies)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 9. Sigorta Tipleri (Insurance Types)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 10. Ödeme Tipleri (Payment Types)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 11. Ödeme Hesapları (Payment Accounts)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 12. Para Birimleri (Currencies)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 13. Ajanslar (Agencies)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 14. Servis Şirketleri (Service Companies)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 15. Servis Tipleri (Service Types)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 16. Tedarikçi Kategorileri (Supplier Categories)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 17. Lastik Markaları (Tire Brands)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 18. Lastik Modelleri (Tire Models)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Lastik markasına göre filtreleme
- [ ] Toplu yükleme/import

### 19. Lastik Tipleri (Tire Types)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 20. Lastik Pozisyonları (Tire Positions)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 21. Lastik Durumları (Tire Conditions)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

### 22. Tedarikçiler (Tyre Suppliers)
- [ ] Listeleme, ekleme, düzenleme, silme
- [ ] Toplu yükleme/import

---

## Genel İş Akışı
1. Ortak bir DefinitionsDashboard veya DefinitionsMenu oluşturulacak.
2. Her tanım için ayrı bir sayfa/component ile CRUD işlemleri yapılacak.
3. Tanımlar arası ilişkiler (örn. marka → model) canlı olarak uygulanacak.
4. Tüm formlar, kullanıcı dostu hata mesajları ve validasyon ile desteklenecek.
5. Toplu yükleme/import desteği için uygun arayüzler eklenecek.

---

> **Not:** Her modül için ilerleme kutuları güncellenecek ve tamamlandıkça işaretlenecek.
