import React from 'react';
import { useVehicleImportExport } from './useVehicleImportExport';
import { StepperComponent } from './components/Stepper';
import { Step1_Upload } from './components/Step1_Upload';
import { Step2_Preview } from './components/Step2_Preview';
import { Step3_Result } from './components/Step3_Result';

export const VehicleImportExport: React.FC = () => {
  const {
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
  } = useVehicleImportExport();

  return (
    <div className="flex flex-col gap-4 h-full p-6">
      <StepperComponent currentStep={currentStep} />
      <div className="flex-1 flex flex-col overflow-y-hidden pt-4">
        {currentStep === 1 && (
          <Step1_Upload 
            onFileSelect={processFile}
            onDownloadTemplate={handleDownloadTemplate}
            isProcessing={isProcessing}
            isDownloading={isDownloading}
            fileError={fileError}
          />
        )}
        {currentStep === 2 && (
          <Step2_Preview 
            previewData={previewData}
            fileName={fileName}
            onConfirm={handleConfirmImport}
            onCancel={resetProcess}
            isUploading={isUploading}
          />
        )}
        {currentStep === 3 && result && (
          <Step3_Result result={result} onReset={resetProcess} />
        )}
      </div>
    </div>
  );
};
