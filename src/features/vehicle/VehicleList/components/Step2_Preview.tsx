import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, AlertTriangle, ArrowLeft, FileCheck2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DataTable } from '@/components/ui/table/data-table';
import { useReactTable, getCoreRowModel, getPaginationRowModel, type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PreviewRow } from '../useVehicleImportExport';

const DataPreviewTable: React.FC<{ data: PreviewRow[] }> = ({ data }) => {
  const columns = React.useMemo<ColumnDef<PreviewRow>[]>(() => {
    if (!data || data.length === 0) return [];

    const staticColumns: ColumnDef<PreviewRow>[] = [
      {
        id: 'status',
        header: 'Durum',
        size: 100,
        cell: ({ row }) => {
          const hasError = row.original.errors.length > 0;
          return hasError ? (
            <Badge variant="destructive">Hata</Badge>
          ) : (
            <Badge variant="success">Geçerli</Badge>
          );
        },
      },
      {
        accessorKey: 'rowIndex',
        header: 'Satır',
        size: 80,
      },
    ];

    const dynamicHeaders = Object.keys(data[0].data);
    const dynamicColumns: ColumnDef<PreviewRow>[] = dynamicHeaders.map(header => ({
      accessorFn: (row) => row.data[header],
      id: header,
      header: header,
    }));

    return [...staticColumns, ...dynamicColumns];
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
      columnPinning: {
        left: ['status'],
      }
    }
  });

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Bu sayfada görüntülenecek veri yok.
      </div>
    );
  }
  
  const validCount = data.filter(row => row.errors.length === 0).length;
  const invalidCount = data.length - validCount;

  return (
    <div className="flex flex-col gap-4">

      <DataTable
        table={table}
        getRowProps={(row) => ({
          className: row.original.errors.length > 0 ? 'bg-red-50/50 dark:bg-red-950/20' : '',
        })}
      />
      {invalidCount > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Hatalı Kayıtlar Bulundu!</AlertTitle>
          <AlertDescription>
            Hatalı olarak işaretlenen kayıtlar içe aktarılmayacaktır. Lütfen Excel dosyanızı düzeltip tekrar yükleyin veya sadece geçerli kayıtlarla devam edin.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export const Step2_Preview: React.FC<{ 
  previewData: { [sheetName: string]: PreviewRow[] };
  fileName: string | null;
  onConfirm: () => void;
  onCancel: () => void;
  isUploading: boolean;
}> = ({ previewData, fileName, onConfirm, onCancel, isUploading }) => (
  <div className="flex-1 flex flex-col min-h-0">
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Veri Önizleme ve Doğrulama</h3>
          <div className="flex items-center gap-2">
            <Badge variant="success">Geçerli: {Object.values(previewData).reduce((acc, data) => acc + data.filter(r => r.errors.length === 0).length, 0)}</Badge>
            <Badge variant="destructive">Hatalı: {Object.values(previewData).reduce((acc, data) => acc + data.filter(r => r.errors.length > 0).length, 0)}</Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Yüklenen dosya: <span className="font-medium">{fileName}</span>. Hatalı satırlar arka planda ayıklanacaktır.
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-y-hidden">
        <Tabs defaultValue={Object.keys(previewData)[0]} className="flex-1 flex flex-col">
          <TabsList className="px-6 flex-shrink-0">
            {Object.keys(previewData).map(sheetName => (
              <TabsTrigger key={sheetName} value={sheetName}>{sheetName}</TabsTrigger>
            ))}
          </TabsList>
          {Object.keys(previewData).map(sheetName => (
            <TabsContent key={sheetName} value={sheetName} className="flex-1 overflow-y-auto mt-2">
              <DataPreviewTable data={previewData[sheetName]} />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
    <div className="flex-shrink-0 flex justify-end space-x-4 pt-4 border-t">
      <Button variant="outline" onClick={onCancel} disabled={isUploading} className="h-12 px-6 text-base flex items-center gap-2">
        <ArrowLeft size={16} /> Geri Dön ve Düzelt
      </Button>
      <Button onClick={onConfirm} disabled={isUploading || Object.values(previewData).every(data => data.filter(r => r.errors.length === 0).length === 0)} className="h-12 px-6 text-base flex items-center gap-2">
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
        {isUploading ? 'İçe Aktarılıyor...' : `Geçerli ${Object.values(previewData).reduce((acc, data) => acc + data.filter(r => r.errors.length === 0).length, 0)} Kaydı İçe Aktar`}
      </Button>
    </div>
  </div>
);
