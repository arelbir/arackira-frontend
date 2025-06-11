import React, { useState } from 'react';
import { toast } from 'sonner';
import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileSpreadsheet, Download, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useVehicleImportService, type VehicleImportResult } from './vehicle-import-service';

/**
 * Araç toplu içe/dışa aktarım bileşeni
 */
export const VehicleImportExport: React.FC = () => {
  const { downloadTemplate, importVehicles } = useVehicleImportService();
  
  // State tanımları
  const [files, setFiles] = useState<File[]>([]);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [result, setResult] = useState<VehicleImportResult | null>(null);
  
  // Excel şablonu indirme işlemi
  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true);
      await downloadTemplate();
      toast.success('Excel şablonu indirildi');
    } catch (error) {
      toast.error(`Şablon indirme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Excel dosyası yükleme ve içe aktarma işlemi
  const handleImport = async (uploadedFiles: File[]) => {
    try {
      setIsUploading(true);
      setResult(null);
      
      // Dosya kontrolü
      if (uploadedFiles.length === 0) {
        throw new Error('Lütfen bir Excel dosyası seçin');
      }
      
      const file = uploadedFiles[0];
      
      // Dosya uzantı kontrolü
      const validExtensions = ['.xlsx', '.xls'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        throw new Error('Lütfen geçerli bir Excel dosyası (.xlsx veya .xls) seçin');
      }
      
      // İçe aktarım işlemini başlat
      const importResult = await importVehicles(file);
      setResult(importResult);
      
      if (importResult.success) {
        toast.success(importResult.message);
      } else {
        toast.error(importResult.message);
      }
      
      // Tamamlandıktan sonra dosya listesini temizle
      setFiles([]);
      
    } catch (error) {
      toast.error(`İçe aktarma hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Araç Veri Aktarımı</CardTitle>
        <CardDescription>
          Excel dosyası kullanarak araçlarınızı toplu olarak yönetebilirsiniz.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Şablon İndirme Butonu */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-medium">1. Excel Şablonunu İndirin</h3>
          <p className="text-sm text-muted-foreground">
            İçe aktarım işlemi için hazırlanmış Excel şablonunu kullanın. Tüm gerekli alanlar ve açıklamalar şablonda mevcuttur.
          </p>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto flex items-center gap-2" 
            onClick={handleDownloadTemplate}
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Excel Şablonunu İndir
          </Button>
        </div>
        
        {/* Dosya Yükleme */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-sm font-medium">2. Doldurduğunuz Excel Dosyasını Yükleyin</h3>
          <p className="text-sm text-muted-foreground">
            Verileri doldurduktan sonra dosyayı buraya yükleyin. Şasi numarası tüm araçlar için zorunludur.
          </p>
          
          <FileUploader
            value={files}
            onValueChange={setFiles}
            accept={{
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              'application/vnd.ms-excel': ['.xls'],
            }}
            maxSize={1024 * 1024 * 10} // 10MB
            maxFiles={1}
            multiple={false}
            disabled={isUploading}
          />
          
          <Button 
            variant="default" 
            className="w-full sm:w-auto flex items-center gap-2 mt-2" 
            onClick={() => handleImport(files)}
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            İçe Aktar
          </Button>
        </div>
        
        {/* Sonuçlar */}
        {result && (
          <div className="flex flex-col space-y-4 border rounded-lg p-4 bg-muted/20">
            <h3 className="text-sm font-medium">Aktarım Sonucu</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Başarıyla Eklenen</span>
                <span className="text-2xl font-bold text-green-700 dark:text-green-400">{result.inserted}</span>
              </div>
              
              <div className="flex flex-col space-y-1 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                <span className="text-sm font-medium text-red-700 dark:text-red-400">Başarısız Olan</span>
                <span className="text-2xl font-bold text-red-700 dark:text-red-400">{result.failed}</span>
              </div>
            </div>
            
            {result.failed > 0 && result.errorReport && (
              <Alert variant="destructive" className="mt-2">
                <AlertTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Hata raporu otomatik olarak indirildi
                </AlertTitle>
                <AlertDescription>
                  Başarısız olan kayıtlar için hata raporu oluşturuldu ve indirildi.
                  Lütfen hatalarınızı düzelttikten sonra tekrar deneyiniz.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col items-start">
        <div className="text-xs text-muted-foreground mt-4">
          <p><strong>Not:</strong> İçe aktarım sırasında şasi numarası zorunludur ve benzersiz olmalıdır. 
            Hatalı kayıtlar için detaylı rapor alacak ve hatalarınızı düzeltip tekrar deneyebileceksiniz.</p>
        </div>
      </CardFooter>
    </Card>
  );
};
