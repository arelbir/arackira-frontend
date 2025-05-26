"use client";

import React, { useCallback, useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/router';
import { VehicleFormValues } from './vehicle-schema';
import { useForm } from 'react-hook-form';
import VehicleTabs from './VehicleTabs';
import { createVehicle, updateVehicle, getDraftVehicleById } from './vehicleService';
import { preparePayloadForSave } from './utils/formUtils';
import { useVehicleNotification } from './hooks/useVehicleNotification';

const VehicleCreatePage: React.FC = () => {
  const form = useForm<VehicleFormValues>({ mode: 'onTouched' });
  const [loading, setLoading] = useState<boolean>(false);
  const notification = useVehicleNotification();
  const [draftCreated, setDraftCreated] = useState<boolean>(false);
  const [plateLastSaved, setPlateLastSaved] = useState<string>("");

  // DraftId parametresi varsa formu draft ile başlat
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const draftId = params.get('draftId');
    if (draftId) {
      setLoading(true);
      getDraftVehicleById(Number(draftId))
        .then(draft => {
          form.reset(draft);
        })
        .catch(() => {
          notification.error('Taslak araç getirilemedi.');
        })
        .finally(() => setLoading(false));
    }
  }, []);

  // Plaka geçerli olduğunda kontrolü durdurmak için referans tut
  const [validatedPlates, setValidatedPlates] = useState<{[key: string]: boolean}>({});
  
  // Plaka değişimini izle ve validasyon yap, ama otomatik kayıt yapma
  const handlePlateChange = useCallback((plateNumber: string) => {
    // Boş plaka ve fazla kısa plakaları geç
    if (!plateNumber || plateNumber.length < 5) {
      return;
    }
    
    // Bu plaka daha önce onaylandıysa tekrar kontrol etme
    if (validatedPlates[plateNumber]) {
      return;
    }
    
    // Sadece plaka formatını kontrol et
    const isValid = /^[0-9]{2}[A-Z]{1,3}[0-9]{2,4}$/.test(plateNumber.toUpperCase());
    console.log('Plaka geçerliliği kontrol ediliyor:', plateNumber, isValid);
    
    // Eğer geçerliyse, bu plakayı onaylanmış listeye ekle
    if (isValid) {
      setValidatedPlates(prev => ({
        ...prev,
        [plateNumber]: true
      }));
    }
    
    // Form'a plaka değerini yaz
    form.setValue('plate_number', plateNumber);
  }, [form, validatedPlates]);

  // Sekme değişiminde otomatik kaydetme - güncelleme veya taslak oluşturma
  const handleAutoSave = useCallback(async (values: VehicleFormValues): Promise<any> => {
    // Eğer ID varsa güncelleme yap
    if (values.id) {
      try {
        // Payload hazırla
        const payload = preparePayloadForSave(values, true); // is_draft: true
        
        // Güncelleme yap
        const result = await updateVehicle(Number(values.id), payload);
        console.log(`Tab değişimi sırasında araç güncellendi, ID: ${values.id}`);
        return result;
      } catch (err) {
        console.error("Güncelleme hatası:", err);
        notification.handleVehicleUpdateError(err);
        throw err;
      }
    }
    
    // ID yoksa ve geçerli bir plaka varsa yeni bir taslak oluştur
    if (!values.id && values.plate_number && values.plate_number.trim().length >= 5) {
      try {
        setLoading(true);
        
        // Taslak oluşturmak için minimal veri hazırla
        const draftData = { 
          plate_number: values.plate_number, 
          vehicle_status_id: 1, // Not-null constraint için default değer
          is_draft: true 
        };
        
        // Taslak araç oluştur
        const result = await createVehicle(draftData);
        
        // Başarılı oluşturma
        console.log(`Tab değişimi sırasında taslak oluşturuldu, ID: ${result.id}`);
        
        // Form'a ID'yi yaz
        form.setValue('id', result.id);
        setDraftCreated(true);
        setPlateLastSaved(values.plate_number);
        
        return result;
      } catch (err) {
        console.error("Taslak oluşturma hatası:", err);
        notification.handleVehicleCreationError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    }
    
    // Geçerli plaka yoksa hata fırlat
    throw new Error("Geçerli bir plaka girilmeden sekme değişimi yapılamaz");
  }, [notification, form, setDraftCreated, setPlateLastSaved, setLoading]);

  // Gerçek API entegrasyonu
  const handleSubmit = async (data: VehicleFormValues) => {
    setLoading(true);
    try {
      // Boş string ve undefined değerleri yönet, sayısal değerleri dönüştür
      const processField = (value: any) => {
        // Boş string kontrolu (select'lerde sık karşılaşılır)
        if (value === '') return undefined;
        // Undefined veya null kontrolü
        if (value === undefined || value === null) return undefined;
        return value;
      };
      
      // Sayısal alanları dönüştür
      const parseNumberField = (value: any) => {
        const processed = processField(value);
        if (processed === undefined) return undefined;
        const num = Number(processed);
        return isNaN(num) ? undefined : num;
      };

      // Tüm id alanlarını number'a çevir, gereksiz alanları çıkar, eksik alanları ekle
      let payload = {
        ...data,
        is_draft: false, // Tam kayıt için is_draft false
        branch_id: parseNumberField(data.branch_id),
        vehicle_type_id: parseNumberField(data.vehicle_type_id),
        brand_id: parseNumberField(data.brand_id),
        model_id: parseNumberField(data.model_id),
        vehicle_status_id: parseNumberField(data.vehicle_status_id),
        package: processField(data.package),
        vehicle_group_id: parseNumberField(data.vehicle_group_id),
        fuel_type_id: parseNumberField(data.fuel_type_id),
        transmission_id: parseNumberField(data.transmission_id),
        model_year: parseNumberField(data.model_year),
        color_id: parseNumberField(data.color_id),
        engine_power_hp: parseNumberField(data.engine_power_hp),
        engine_volume_cc: parseNumberField(data.engine_volume_cc),
        vehicle_responsible_id: parseNumberField(data.vehicle_responsible_id),
        vehicle_km: parseNumberField(data.vehicle_km),
        acquisition_cost: parseNumberField(data.acquisition_cost),
        current_client_company_id: parseNumberField(data.current_client_company_id),
      };
      
      // Debug: Payloadı göster
      console.log('Gönderilecek payload:', JSON.stringify(payload, null, 2));
      
      // TypeScript için object'leri dinamik olarak erişilebilir hale getirelim
      const payloadAsAny = payload as any;
      const dataAsAny = data as any;
      
      // Select elemanları için ek kontrol
      // Boş stringleri undefined yerine null yapalım
      // Backend bazı veritabanı sütunları için undefined yerine null bekliyor olabilir
      Object.keys(payloadAsAny).forEach(key => {
        if (payloadAsAny[key] === '' || payloadAsAny[key] === undefined) {
          payloadAsAny[key] = null;
        }
      });
      
      // dropdown alanları için ekstra kontrol - veritabanında integer olan foreign key alanları
      const dropdownFields = [
        'branch_id', 
        'vehicle_type_id', 
        'brand_id', 
        'model_id', 
        'vehicle_status_id',
        'vehicle_group_id', 
        'fuel_type_id', 
        'transmission_id', 
        'color_id',
        'vehicle_responsible_id',
        'current_client_company_id'
      ];
      
      // Dropdown değerlerini daha sert bir şekilde işleyelim
      dropdownFields.forEach(field => {
        // Her alan için debug bilgisi yazdır
        console.log(`${field} değeri: '${dataAsAny[field]}', tipi: ${typeof dataAsAny[field]}`);
        
        // Boş string ve null değerleri undefined yap
        if (dataAsAny[field] === '' || dataAsAny[field] === null) {
          payloadAsAny[field] = null;
        }
        // String değerleri sayıya çevir
        else if (typeof dataAsAny[field] === 'string') {
          // Eğer geçerli bir sayı ise çevir, değilse null gönder
          const num = Number(dataAsAny[field]);
          payloadAsAny[field] = isNaN(num) ? null : num;
        }
        // Sayısal değer ise aynen kullan
        else if (typeof dataAsAny[field] === 'number') {
          payloadAsAny[field] = dataAsAny[field];
        }
        // Diğer tüm durumlar için null gönder
        else {
          payloadAsAny[field] = null;
        }
        
        // Dönüşüm sonrası debug bilgisi
        console.log(`${field} dönüştürülen değeri: ${payloadAsAny[field]}, tipi: ${typeof payloadAsAny[field]}`);
      });
      
      // payloadAsAny'i payload'a geri ata
      payload = payloadAsAny;
      
      // Debug: Son payload
      console.log('Güncellenmiş payload:', JSON.stringify(payload, null, 2));
      
      // Final checks: foreign key alanlarının tümü number olmalı
      dropdownFields.forEach(field => {
        if (payloadAsAny[field] !== null && typeof payloadAsAny[field] !== 'number') {
          console.warn(`UYARI: ${field} alanı hala sayısal değil: ${payloadAsAny[field]}. Number'a çeviriliyor.`);
          try {
            payloadAsAny[field] = Number(payloadAsAny[field]);
            if (isNaN(payloadAsAny[field])) payloadAsAny[field] = null;
          } catch (e) {
            console.error(`${field} alanı sayıya çevrilemedi:`, e);
            payloadAsAny[field] = null;
          }
        }
      });
      
      // Eğer form'da bir id varsa (otomatik taslak oluşturulmuşsa), güncelle
      if (data.id) {
        console.log('Araç güncelleniyor, ID:', data.id);
        await updateVehicle(Number(data.id), payload);
        notification.vehicleUpdatedSuccess();
      } else {
        // Id yoksa yeni kayıt oluştur
        console.log('Yeni araç oluşturuluyor');
        await createVehicle(payload);
        notification.vehicleCreatedSuccess();
      }
      
      // Başarılı işlem sonrası formu sıfırla
      form.reset();
      setDraftCreated(false);
      setPlateLastSaved("");
    } catch (err: any) {
      // Özelleştirilmiş hata işleme
      if (data.id) {
        notification.handleVehicleUpdateError(err);
      } else {
        notification.handleVehicleCreationError(err);
      }
      console.error('Kaydetme hatası:', err);
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="w-full h-full min-h-[calc(100vh-56px)] flex flex-col">
        <div className="flex-1 w-full h-full bg-background p-0 md:p-4 flex flex-col gap-4 justify-start">
          {notification.notificationElement}
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
                    notification.success('Taslak kaydedildi!', 'Yerel Depolama');
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
              <VehicleTabs 
                form={form} 
                mode="create" 
                onSubmit={handleSubmit}
                onPlateChange={handlePlateChange}
                onAutoSave={handleAutoSave}
                loading={loading} 
              />
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default VehicleCreatePage;