# Araç Modülü Component & Yapı Dokümantasyonu

Bu doküman, `frontend/src/features/vehicle` altındaki tüm ana component, yardımcı component, hook ve servislerin ne işe yaradığını ve nasıl kullanıldığını açıklar.

---

## 1. Sayfa Component'leri

### VehicleListPage.tsx
- **Amaç:** Tüm araçları tablo halinde listeler.
- **Özellikler:**
  - Araçları API'den çeker ve filtreler.
  - Detay modalı açar.
  - (Geliştirilebilir) Araç silme ve düzenleme işlemleri.

### VehicleDraftListPage.tsx
- **Amaç:** Taslak (henüz tamamlanmamış) araçları listeler ve yönetir.
- **Özellikler:**
  - Taslakları listeler, siler.
  - "Devam Et" ile draft formuna yönlendirir.

### VehicleCreatePage.tsx
- **Amaç:** Yeni araç ekleme ve draft'tan devam etme formunu içerir.
- **Özellikler:**
  - Tüm form adımlarını ve validasyonları içerir.
  - Taslak ID ile açılırsa formu otomatik doldurur.

### VehicleEditPage.tsx
- **Amaç:** Mevcut bir aracı düzenlemeyi sağlar.
- **Özellikler:**
  - Route parametresinden araç ID alır, ilgili aracı API'den çeker.
  - Formu günceller ve kaydeder.

---

## 2. Yardımcı Component'ler

### VehicleDetailModal.tsx
- **Amaç:** Araç detaylarını modal olarak gösterir.
- **Kullanım:** Hem liste sayfalarında hem de başka yerlerde açılabilir.

### form/ klasörü
- **FormDateField.tsx, FormInputField.tsx, FormSelectField.tsx:**
  - Form için özelleştirilmiş input component'leri.
- **useVehicleStatuses.ts:**
  - Araç statüleri için yardımcı hook.

### tabs/ klasörü
- **VehicleGeneralInfoTab.tsx, VehicleOtherInfoTab.tsx, VehicleInsuranceTab.tsx, VehicleLicenseTab.tsx, VehicleOwnershipTab.tsx:**
  - Araç formunun sekmelerini oluşturan component'ler.
  - Her biri ilgili form alanlarını ve validasyonları içerir.

---

## 3. Hook'lar

### hooks/useVehicle.ts
- **Amaç:** Araç CRUD işlemlerini (listeleme, ekleme, düzenleme, silme) yönetir.
- **Kapsam:** Tüm araç işlemlerinde state ve API yönetimi için kullanılır.

### hooks/useInsurance.ts
- **Amaç:** Araç sigorta işlemleri için özel hook.
- **Kapsam:** Sadece sigorta tabında veya ilgili formlarda kullanılır.

---

## 4. Servis ve Şema

### vehicleService.ts
- **Amaç:** Tüm araç API çağrılarını merkezi olarak yönetir.
- **Fonksiyonlar:** getAllVehicles, createVehicle, updateVehicle, deleteVehicle, getDraftVehicles, getDraftVehicleById, deleteDraftVehicle

### vehicle-schema.ts
- **Amaç:** Form validasyonu için Zod ile oluşturulmuş araç şeması.
- **Kapsam:** Tüm araç formlarında kullanılır.

---

## 5. Diğer

### vehicle-module-improvement-plan.md
- **Amaç:** Modülün iyileştirme ve geliştirme yol haritası, ekip içi notlar.

---

## Notlar
- Tüm sayfa component'leri `ProtectedRoute` ile korunmalı.
- Hook ve yardımcı component'ler sadece ilgili modül altında tutulur, global kullanılmaz.
- Kodun tamamı modern React ve proje standartlarına uygundur.

---

Bu doküman, modülün bakımını ve yeni katılan geliştiriciler için anlaşılabilirliğini artırmak amacıyla hazırlanmıştır.
