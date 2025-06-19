# Arackira UI - Tablo Bileşenleri Dokümantasyonu

Bu dokümantasyon, uygulamanın farklı modüllerinde kullanılabilecek tablo bileşenlerini tanımlar. Tüm tablo bileşenleri, TanStack React Table v8 kütüphanesini temel alır ve shadcn-ui ile genişletilmiştir.

## İçindekiler

- [Genel Bakış](#genel-bakış)
- [Ana Bileşenler](#ana-bileşenler)
- [Modüler Yapı](#modüler-yapı)
- [Kullanım Kılavuzu](#kullanım-kılavuzu)
- [İşlevsel Bileşenler](#işlevsel-bileşenler)
- [Yardımcı Hooklar](#yardımcı-hooklar)
- [Örnek Kullanım](#örnek-kullanım)

## Genel Bakış

Tablo sistemi, DRY (Don't Repeat Yourself) prensiplerine uygun olarak yeniden tasarlandı. Ana amaçlar:

- **Modülerlik**: Her bileşen tek bir sorumluluğa sahip
- **Tip Güvenliği**: TypeScript ile tam tip kontrolü
- **İş ve Görünüm Ayrımı**: UI rendering ve iş mantığının ayrılması
- **Yeniden Kullanılabilirlik**: Farklı modüllerde minimum düzenleme ile kullanım
- **UX İyileştirmeler**: Layout shift önleyen tasarımlar, animasyonlar ve klavye kısayolları

## Ana Bileşenler

### DataTable

Tüm tablo sisteminin ana bileşeni. TanStack React Table ile entegre edilmiştir.

```tsx
<DataTable
  columns={columns}
  data={data}
  resourceUrl="/api/resource" // API endpoint
  onAction={() => mutate()} // İşlem sonrası callback
  editBasePath="/dashboard/resource" // Düzenleme sayfası base path
/>
```

### DataTableToolbar

Tablo üzerindeki araç çubuğu (filtreler, görünüm ayarları, toplu işlemler).

```tsx
<DataTableToolbar 
  table={table}
  resourceUrl="/api/resource"
  onAction={() => mutate()}
  editBasePath="/dashboard/resource"
/>
```

## Modüler Yapı

`DataTableToolbar` aşağıdaki modüler alt bileşenlerden oluşur:

1. **DataTableMainToolbar**: Temel toolbar işlevselliği
2. **DataTableBulkActionsSlideIn**: Toplu işlemler için slide-in araç çubuğu
3. **DataTableFilters**: Filtre sistemi
4. **DataTableViewOptions**: Kolon görünürlük kontrolü
5. **ActionButton**: Yeniden kullanılabilir aksiyon butonu

Bu modüler yapı, kodun okunabilirliğini artırır ve bakımını kolaylaştırır.

## İşlevsel Bileşenler

### DataTablePagination

Tablo sayfalama kontrolü sağlar. Sayfa boyutu seçimi ve sayfa navigasyonu içerir.

```tsx
<DataTablePagination table={table} />
```

### DataTableColumnHeader

Kolon başlıklarını ve sıralama işlevselliğini yönetir. Tıklanabilir başlık ve sıralama göstergeleri sunar.

```tsx
<DataTableColumnHeader column={column} title="Kolon Başlığı" />
```

### DataTableFilter

Farklı filtre tiplerini (text, date, faceted, slider...) yöneten üst düzey bileşen. Kolon meta verisindeki `variant` özelliğine göre uygun filtre tipini render eder.

```tsx
<DataTableFilter column={column} />
```

### DataTableBulkActionsSlideIn

Seçili satırlar için slide-in animasyonlu aksiyon çubuğu. Toplu silme ve geri alma işlemlerini sunar.

```tsx
<DataTableBulkActionsSlideIn
  selectedRows={selectedRows}
  resourceUrl="/api/resource"
  onAction={() => mutate()}
  editBasePath="/dashboard/resource"
/>
```

### DataTableMainToolbar

Ana toolbar bileşeni. Tablo başlığı, filtreler ve görünüm seçeneklerini içerir.

```tsx
<DataTableMainToolbar table={table} filterVariants={filterVariants}>
  {/* İsteğe bağlı alt bileşenler */}
</DataTableMainToolbar>
```

### DataTableFilters

Filtre bileşenlerini organize eder. Temel filtreler ve gelişmiş filtreler için sheet dialog içerir.

```tsx
<DataTableFilters table={table} filterVariants={filterVariants} />
```

### DataTableFacetedFilter

Faceted filtreleme seçenekleri sunar. Dropdown içinde çoklu seçim yapılabilir.

```tsx
<DataTableFacetedFilter
  column={column}
  title="Kategori"
  options={[
    { label: 'Aktif', value: 'active' },
    { label: 'Pasif', value: 'inactive' }
  ]}
/>
```

### DataTableDateFilter

Tarih aralığı seçimi için özel filtreleme bileşeni.

```tsx
<DataTableDateFilter column={column} />
```

### DataTableSliderFilter

Sayısal değerler için slider bazlı filtreleme bileşeni.

```tsx
<DataTableSliderFilter column={column} />
```

### DataTableViewOptions

Kolonların görünürlüğünü kontrol eden dropdown menü.

```tsx
<DataTableViewOptions table={table} />
```

### DataTableConfirmDialog

Toplu silme ve geri alma işlemlerinde onay almak için kullanılan dialog bileşeni.

```tsx
<DataTableConfirmDialog
  isOpen={isDialogOpen}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
  title="Silme Onayı"
  description="Seçilen kayıtları silmek istediğinize emin misiniz?"
/>
```

### ActionButton

Yükleme durumunu destekleyen, yeniden kullanılabilir aksiyon butonu.

```tsx
<ActionButton
  onClick={handleClick}
  variant="destructive"
  size="sm"
  isLoading={isProcessing}
>
  <Trash className="h-4 w-4 mr-2" />
  Sil
</ActionButton>
```

### DataTableSkeleton

Tablo verisi yüklenirken gösterilen iskelet yükleme göstergesi.

```tsx
<DataTableSkeleton columns={5} rows={10} />
```

## Yardımcı Hooklar

### useBulkActions

Toplu işlemleri (silme, geri alma) merkezi olarak yönetir.

```tsx
const { isProcessing, handleBulkDelete, handleBulkRestore } = useBulkActions({
  resourceUrl: "/api/resource",
  onAction: () => mutate()
});
```

### useDeleteResource ve useRestoreResource

Silme ve geri alma işlemleri için API çağrılarını yönetir.

```tsx
const { deleteResource } = useDeleteResource("/api/resource");
const { restoreResource } = useRestoreResource("/api/resource");
```

## Tip Tanımları

Tablo bileşenlerinde kullanılan özel tip tanımları:

- `CustomColumnMeta`: Kolon meta verilerini tanımlar
- `FilterVariant`: Desteklenen filtre tiplerini tanımlar
- `Option`: Faceted filtrelerde kullanılan seçenek tipini tanımlar

## Örnek Kullanım

`useXXXTable` hook'u ile bir tablo oluşturarak başlayın:

```tsx
// useClientTable.ts
export function useClientTable(data: Client[], columnsToDisplay?: string[]) {
  // Kolonları tanımla
  const columns = useMemo<ColumnDef<Client>[]>(() => [
    // Seçim kolonunu ekle - Checkbox
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Tümünü seç"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Satırı seç"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // Diğer kolonlar...
  ], []);
  
  // Tablo hookunu kullan
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    meta: {
      mutate: mutate, // SWR mutate fonksiyonu
    },
  });

  return {
    table,
    columns,
  };
}
```

Sonra, bileşeninizde tabloyu render edin:

```tsx
// ClientList/index.tsx
export default function ClientList() {
  const { data = [], mutate } = useClients();
  const { table } = useClientTable(data);
  
  return (
    <div className="flex-1 space-y-4">
      <DataTable
        table={table}
        columns={columns}
        data={data}
        resourceUrl="/api/clients"
        onAction={() => mutate()}
        editBasePath="/dashboard/clients"
      >
        <DataTableToolbar 
          table={table}
          resourceUrl="/api/clients"
          onAction={() => mutate()}
          editBasePath="/dashboard/clients" 
        />
        <DataTablePagination table={table} />
      </DataTable>
    </div>
  );
}
```

---

Bu dokümantasyon, tablo bileşenleri sisteminin genel yapısını ve kullanımını anlatır. Ek detaylar veya spesifik senaryolar için ilgili bileşen kaynak kodlarına bakabilirsiniz.
