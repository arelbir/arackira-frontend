import React from 'react';
import { CheckCircle } from 'lucide-react';

export const StepperComponent: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = ['1. Dosya Yükle', '2. Verileri Doğrula', '3. Sonucu Gör'];
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isActive ? 'bg-primary text-primary-foreground scale-110' : isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                {isCompleted ? <CheckCircle size={16} /> : stepNumber}
              </div>
              <p className={`mt-2 text-xs text-center font-medium transition-all duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </p>
            </div>
            {index < steps.length - 1 && <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${isCompleted || isActive ? 'bg-primary' : 'bg-muted'}`} />} 
          </React.Fragment>
        );
      })}
    </div>
  );
};
