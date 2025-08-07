import { useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { useVehicleImportService, type VehicleImportResult } from './vehicle-import-service';

export type PreviewRow = {
  rowIndex: number;
  data: Record<string, any>;
  errors: string[];
};

const EXPECTED_SHEETS = ['Vehicles', 'Insurances', 'Inspections', 'HGS', 'GPS', 'UTTS'];

// Excel'in seri numarasını JavaScript Date nesnesine dönüştürür.
// Excel'de tarihler, 1900 tabanlı bir sistemde gün sayısı olarak saklanır.
// JavaScript'te ise milisaniye tabanlıdır. Bu fonksiyon aradaki dönüşümü yapar.


const formatDateToDDMMYYYY = (date: Date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Aylar 0'dan başlar
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const convertExcelDate = (excelDate: number) => {
  if (typeof excelDate !== 'number' || excelDate <= 0) {
    return null; // veya excelDate'i doğrudan döndür
  }
  // Excel'in 1900 yılını artık yıl olarak yanlış hesaplamasından kaynaklanan hatayı düzeltir.
  // Bu hata, 29 Şubat 1900'ü geçerli bir tarih olarak saymasından kaynaklanır.
  const excelEpoch = new Date(1899, 11, 30);
  const jsDate = new Date(excelEpoch.getTime() + excelDate * 86400000);
  
  // Saat dilimi farkını dengelemek için UTC tarihini kullan
  return new Date(jsDate.getTime() + (jsDate.getTimezoneOffset() * 60000));
};

const downloadErrorReport = (errorReport: { buffer: string; filename: string }) => {
  const { buffer, filename } = errorReport;
  const byteCharacters = atob(buffer);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const useVehicleImportExport = () => {
  const { downloadTemplate, importVehicles } = useVehicleImportService();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, PreviewRow[]>>({});
  const [fileError, setFileError] = useState<string | null>(null);
  const [result, setResult] = useState<VehicleImportResult | null>(null);

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true);
      await downloadTemplate();
      toast.success('Excel şablonu başarıyla indirildi.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
      toast.error(`Şablon indirilemedi: ${errorMessage}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const processFile = async (uploadedFiles: File[]) => {
    if (uploadedFiles.length === 0) return;

    const file = uploadedFiles[0];
    resetProcess();
    setIsProcessing(true);
    setOriginalFile(file);
    setFileName(file.name);

    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.xlsx', '.xls'].includes(fileExtension)) {
      setFileError('Geçersiz dosya formatı. Lütfen .xlsx veya .xls uzantılı bir dosya yükleyin.');
      setIsProcessing(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const buffer = event.target?.result;
        if (!buffer) throw new Error('Dosya okunamadı.');

        const workbook = XLSX.read(buffer, { type: 'array' });
        const foundSheets = workbook.SheetNames;

        if (!foundSheets.includes('Vehicles')) {
          setFileError('Geçersiz şablon. "Vehicles" sayfası bulunamadı.');
          setIsProcessing(false);
          return;
        }

        const newPreviewData: Record<string, PreviewRow[]> = {};

        for (const sheetName of EXPECTED_SHEETS) {
          if (foundSheets.includes(sheetName)) {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { cellDates: true, raw: true } as any);

            // Tarih alanlarını manuel olarak dönüştür
            const processedData = jsonData.map(row => {
              const newRow = { ...row };
              Object.keys(newRow).forEach(key => {
                const value = newRow[key];
                if (value instanceof Date) {
                  newRow[key] = formatDateToDDMMYYYY(value);
                } else if (typeof value === 'number' && value > 25569) { // 25569 = 1970-01-01 in Excel serial
                  const converted = convertExcelDate(value);
                  if (converted) {
                    newRow[key] = formatDateToDDMMYYYY(converted);
                  }
                }
              });
              return newRow;
            });

            if (processedData.length === 0) continue; // Boş sayfaları atla

            newPreviewData[sheetName] = processedData.map((row, index) => ({
              rowIndex: index + 2, // Excel'de satırlar 1'den, başlık 1. satırda olduğu için +2
              data: row,
              errors: [], // Önizleme aşamasında hata olmaz, validasyon backend'de yapılır.
            }));
          }
        }

        if (Object.keys(newPreviewData).length === 0) {
            setFileError('Dosyadaki sayfalarda geçerli veri bulunamadı.');
            return;
        }

        setPreviewData(newPreviewData);
        setCurrentStep(2);
      } catch (e) {
        setFileError('Excel dosyası işlenirken bir hata oluştu. Lütfen dosya formatını kontrol edin.');
      } finally {
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setFileError('Dosya okunurken bir hata oluştu.');
      setIsProcessing(false);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmImport = async () => {
    if (!originalFile) {
      toast.error('İçe aktarılacak dosya bulunamadı. Lütfen süreci yeniden başlatın.');
      return;
    }

    try {
      setIsUploading(true);
      setResult(null);

      const importResult = await importVehicles(originalFile);
      setResult(importResult);
      setCurrentStep(3);

      if (importResult.failed > 0 && importResult.errorReport) {
        downloadErrorReport(importResult.errorReport);
      }

      const { inserted, failed } = importResult;

      if (failed === 0 && inserted > 0) {
        toast.success(`${inserted} araç başarıyla içe aktarıldı.`);
      } else if (failed > 0 && inserted > 0) {
        toast.warning(`${inserted} araç eklendi, ${failed} araçta hata oluştu.`);
      } else if (failed > 0 && inserted === 0) {
        toast.error(`İçe aktarma başarısız. ${failed} aracın tamamında hata bulundu.`);
      } else if (!importResult.success) {
        toast.error(importResult.message || 'Bilinmeyen bir hata oluştu.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
      toast.error(`İçe aktarma sırasında bir hata oluştu: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetProcess = () => {
    setCurrentStep(1);
    setPreviewData({});
    setFileError(null);
    setResult(null);
    setFileName(null);
    setOriginalFile(null);
    setIsProcessing(false);
    setIsUploading(false);
  };

  return {
    currentStep,
    isDownloading,
    isProcessing,
    isUploading,
    fileName,
    previewData,
    fileError,
    result,
    handleDownloadTemplate,
    processFile,
    handleConfirmImport,
    resetProcess,
  };
};
