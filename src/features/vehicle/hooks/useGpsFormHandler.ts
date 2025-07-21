"use client";

import { useState, useEffect, useCallback } from 'react';
import { useFormContext, useFieldArray, useForm } from 'react-hook-form';
import { useVehicleForm } from '../create/create-tabs/context/VehicleCreateProvider';
import { transformGpsDataForForm, TransformedGps } from '../utils/data-transformers'; // Bu fonksiyonun varlığını ve doğruluğunu varsayıyoruz
import { GPS_DEFAULT_VALUES, GpsSchemaValues } from '../create/create-tabs/schema'; // Bu tiplerin varlığını varsayıyoruz

/**
 * GPS formu alanlarını yönetmek için custom hook.
 * VehicleCreateProvider'dan GPS verilerini alır ve kendi form state'ini senkronize eder.
 * @returns fields: Form alanları, methods: React Hook Form metotları, isDialogOpen: Dialog durumu, vb.
 */
export function useGpsFormHandler() {
  const { relatedData, setRelatedData, vehicleId } = useVehicleForm();
  const contextGps = relatedData.gps;

  const setContextGps = useCallback((updatedGps: TransformedGps[]) => {
    setRelatedData({
      ...relatedData,
      gps: updatedGps,
    });
  }, [relatedData, setRelatedData]);
  const { control, getValues, reset } = useFormContext();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "gps",
  });

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Context'ten gelen GPS verilerini forma yükle
  useEffect(() => {
    if (contextGps && contextGps.length > 0) {
      // API'den gelen veriyi form formatına dönüştürmek için transformGpsDataForForm kullanılıyor
      const transformedData = transformGpsDataForForm(contextGps);
      reset({ gps: transformedData });
    } else {
      // Eğer contextGps boşsa, varsayılan bir GPS kaydı ile formu başlat
      reset({ gps: [GPS_DEFAULT_VALUES] });
    }
  }, [contextGps, reset]); // reset bağımlılığı eklendi

  const handleAddNew = useCallback(() => {
    setEditingIndex(null);
    append(GPS_DEFAULT_VALUES);
    setDialogOpen(true);
  }, [append]);

  const handleEdit = useCallback((index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    const allGpsData = getValues('gps');
    setContextGps(allGpsData); // Context'i güncel tut
    if (editingIndex !== null) {
      update(editingIndex, allGpsData[editingIndex]);
    } 
    setDialogOpen(false);
    setEditingIndex(null);
  }, [getValues, setContextGps, editingIndex, update]);

  const handleRemove = useCallback((index: number) => {
    remove(index);
    const updatedGps = getValues('gps');
    setContextGps(updatedGps); // Context'i güncel tut
  }, [remove, getValues, setContextGps]);

  return {
    fields: fields || [], // fields'ın her zaman bir dizi olmasını sağla
    methods: { control, getValues, reset }, // React Hook Form metotlarını döndür
    isDialogOpen,
    setDialogOpen,
    editingIndex,
    handleAddNew,
    handleEdit,
    handleSave,
    handleRemove,
    vehicleId,
  };
}
