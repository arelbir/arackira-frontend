# TanStack Table ile Modüler ve DRY Satır İşlemleri (Edit/Sil/Geri Al) Planı

## Amaç
Tüm modüllerde (müşteri, araç, kullanıcı, vs.) tekrar kullanılabilir, DRY prensibine uygun, TanStack Table ile uyumlu satır işlemleri (edit/sil/geri al) altyapısı oluşturmak.

---

## Adım 1: Ortak Generic Hooks ve Bileşenler Oluştur
- [ ] `src/features/common/hooks/useDeleteResource.ts`: Generic silme hook'u
- [ ] `src/features/common/hooks/useRestoreResource.ts`: Generic geri alma hook'u
- [ ] `src/features/common/components/TableActions.tsx`: Generic aksiyon butonları (edit/sil/geri al)

## Adım 2: Modül Tablolarında Actions Kolonu Ekle
- [ ] Her modülün kolon tanımında TableActions bileşeni ile actions kolonu ekle
- [ ] `resourceUrl`, `editPath`, `deleted_at` props ile modüle özel parametreleri aktar

## Adım 3: TanStack Table ile Entegrasyon
- [ ] Mevcut `data-table.tsx` (src/components/ui/table/data-table.tsx) ve TanStack Table instance'ı ile uyumlu şekilde kullan
- [ ] Her satır için TableActions bileşenini custom cell olarak render et

## Adım 4: Test ve Dokümantasyon
- [ ] Müşteri modülünde örnekle başla
- [ ] Diğer modüllerde tekrar kullanımı test et
- [ ] Dokümantasyon ve örnek kullanım ekle

---

## Notlar
- `src/components/ui/table/data-table.tsx` zaten TanStack Table ile uyumlu ve custom cell render'ı destekliyor.
- TableActions bileşeni ve generic hook'lar eklendikten sonra, her modül sadece kolon tanımında bu bileşeni kullanarak tüm işlemleri kolayca ekleyebilir.

---

## Örnek Actions Kolonu (useTableColumns.ts veya doğrudan modül tablosunda)

```typescript
{
  id: "actions",
  header: "İşlemler",
  cell: ({ row }) => (
    <TableActions
      id={row.original.id}
      resourceUrl="/api/clients"
      deleted_at={row.original.deleted_at}
      editPath="/dashboard/clients/[id]/edit"
      onAction={() => row.table.options.meta?.mutate?.()}
    />
  ),
  enableColumnFilter: false,
}
```

---

## Sonuç
- Tüm tablo işlemleri (edit/sil/geri al) tek bir generic component ve hook ile DRY prensibine uygun şekilde yönetilecek.
- TanStack Table'ın tüm özellikleri (filter, sort, pagination, vs.) ile tam uyumlu olacak.
