# Customer Modülü İyileştirme Planı

Bu doküman, `frontend/src/features/customer` modülünün zayıf yönlerini ve iyileştirme/modernizasyon adımlarını özetler. Her adım tamamlandıkça işaretlenecektir.

---

## Zayıf Yönler & İyileştirme Adımları

### 1. Form State Reset ve Güncelleme Eksikliği
- **Sorun:** `CustomerForm` bileşeni, `initialData` değiştiğinde formu otomatik olarak güncellemiyor. Düzenleme modunda eski veriler kalabilir.
- **Çözüm:** `useEffect` ile `initialData` değiştiğinde `form.reset(initialData)` çağrılacak.

### 2. Bileşenlerde Fazla Sorumluluk (Separation of Concerns)
- **Sorun:** Hem `CustomerList` hem de `CustomerForm` çok fazla işlevi aynı dosyada barındırıyor (modal, avatar, detay modalı, kopyalama, vs.).
- **Çözüm:** Avatar, detay modalı, aksiyon menüsü gibi parçalar ayrı küçük bileşenlere ayrılacak.

### 3. API Hatalarının Kullanıcıya Bildirilmemesi
- **Sorun:** API çağrılarında hata oluşursa kullanıcıya anlamlı bir bildirim gösterilmiyor.
- **Çözüm:** Tüm hata mesajları kullanıcıya toast/snackbar veya alert ile gösterilecek. Gerekirse merkezi bir error handler kullanılacak.

### 4. Yeniden Kullanılabilirlik ve Hook Kullanımı
- **Sorun:** Müşteri işlemleri için özel bir hook (`useCustomer`) yok veya yetersiz. Kod tekrarları var.
- **Çözüm:** Tüm müşteri işlemlerini yöneten, loading/error state’lerini ve refetch’i kapsayan bir custom hook (`useCustomer`) standartlaştırılacak.

### 5. Test Eksikliği ve Tip Güvenliği
- **Sorun:** Modülün hiçbir yerinde birim testi veya tip güvenliği artırıcı önlemler yok.
- **Çözüm:** Özellikle servis fonksiyonları ve form validasyonları için birim testleri eklenecek. API’den dönen veri tipleri kesinleştirilecek.

---

## Yol Haritası (Uygulama Sırası)

- [x] 1. CustomerForm’da initialData değişiminde formu resetle (React useEffect ile)
- [x] 2. CustomerList ve CustomerForm’un içindeki yardımcı UI’ları (avatar, detay modalı, aksiyon menüsü) ayrı bileşenlere böl
- [x] 3. API hata mesajlarını kullanıcıya gösterecek merkezi bir error/toast sistemi kur (Merkezi toast sistemi kuruldu, tüm hata/success mesajları kullanıcıya gösteriliyor)
- [x] 4. Tüm müşteri işlemleri için kapsamlı custom hook (`useCustomer`) yaz ve sadece bunu kullan (useCustomer hook'u modernize edildi, tüm işlemler ve state yönetimi tek kaynaktan yönetiliyor)
- [x] 5. customerService.ts ve form validasyonları için birim testleri ekle, tipleri daha katı hale getir (Testler eklendi ve tipler iyileştirildi, modülün mevcut durumu iyi)

Her adım tamamlandıkça bu dosya güncellenecek.
