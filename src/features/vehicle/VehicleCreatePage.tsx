"use client";

import React, { useState } from 'react';
import { VehicleFormValues } from './vehicle-schema';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useForm } from 'react-hook-form';
import VehicleCreateTabs from './VehicleCreateTabs';

const VehicleCreatePage: React.FC = () => {
  const form = useForm<VehicleFormValues>({ mode: 'onTouched' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Simüle edilmiş submit fonksiyonu
  const handleSubmit = async (data: VehicleFormValues) => {
    setLoading(true);
    setToast(null);
    // API isteği simülasyonu
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const isSuccess = Math.random() > 0.3;
    setLoading(false);
    if (isSuccess) {
      setToast({ type: 'success', message: 'Araç başarıyla kaydedildi!' });
      form.reset();
    } else {
      setToast({ type: 'error', message: 'Kayıt sırasında bir hata oluştu.' });
    }
  };

  return (
    <ProtectedRoute>
      <div className="w-full h-full min-h-[calc(100vh-56px)] flex flex-col">
        <div className="flex-1 w-full h-full bg-background p-0 md:p-4 flex flex-col gap-4 justify-start">
          {toast && (
            <div
              className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg text-white transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
              role="alert"
            >
              {toast.message}
            </div>
          )}
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
            <div className="w-full border-b bg-background p-3 flex justify-between items-center gap-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 border border-border bg-transparent hover:bg-muted text-foreground px-3 py-1.5 rounded-md font-normal text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  onClick={() => window.history.back()}
                  aria-label="Geri Dön"
                >
                  <span className="text-lg">←</span> Geri Dön
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 border border-border bg-transparent hover:bg-muted text-foreground px-3 py-1.5 rounded-md font-normal text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  onClick={() => {
                    localStorage.setItem('vehicle-draft', JSON.stringify(form.getValues()));
                    setToast({ type: 'success', message: 'Taslak kaydedildi!' });
                  }}
                  aria-label="Taslağı Kaydet"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                  Taslağı Kaydet
                </button>
              </div>
              <button
                type="submit"
                aria-label="Kaydet"
                disabled={loading}
                className={`inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-md font-normal text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 shadow-none border border-primary/50 hover:bg-primary/90 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2"></span>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                )}
                Kaydet
              </button>
            </div>
            <div className="flex-1">
              <VehicleCreateTabs form={form} />
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VehicleCreatePage;