import React from 'react';
import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Loader2, Download, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const Step1_Upload: React.FC<{ 
  onFileSelect: (files: File[]) => void;
  onDownloadTemplate: () => void;
  isProcessing: boolean;
  isDownloading: boolean;
  fileError: string | null;
}> = ({ onFileSelect, onDownloadTemplate, isProcessing, isDownloading, fileError }) => (
  <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
    <div className="p-6 bg-muted/10 border rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Talimatlar</h3>
      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
        <li>İçe aktarım için <strong className="text-foreground">Excel şablonunu</strong> indirin.</li>
        <li>Verilerinizi şablona uygun şekilde doldurun. <strong className="text-foreground">Şasi Numarası</strong> zorunludur.</li>
        <li>Doldurduğunuz dosyayı aşağıdaki alana sürükleyin veya seçerek yükleyin.</li>
        <li>Yükleme sonrası verileriniz doğrulanmak üzere önizlenecektir.</li>
      </ol>
      <Button 
        variant="outline" 
        className="mt-6 w-full md:w-auto flex items-center gap-2"
        onClick={onDownloadTemplate} 
        disabled={isDownloading || isProcessing}>
        {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {isDownloading ? 'İndiriliyor...' : 'Excel Şablonunu İndir'}
      </Button>
    </div>
    
    <div className="p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center">
      <FileUploader
        value={[]}
        onValueChange={(value) => {
          const files = typeof value === 'function' ? value([]) : value;
          onFileSelect(files);
        }}
        maxFiles={1}
        maxSize={10 * 1024 * 1024}
        disabled={isProcessing}
        accept={{
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
          'application/vnd.ms-excel': ['.xls'],
        }}
      />
      {isProcessing && (
        <div className="flex items-center text-sm text-muted-foreground mt-4">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Dosya işleniyor, lütfen bekleyin...
        </div>
      )}
    </div>

    {fileError && (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Dosya Hatası</AlertTitle>
        <AlertDescription>{fileError}</AlertDescription>
      </Alert>
    )}
  </div>
);
