"use client";

import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormInput } from '@/components/ui/form-input';
import { FormSwitchField } from '../../../../../../components/ui/form-switch-field';
import { GPS_FIELDS } from './gps-constants';

interface GPSFormProps {
  index: number;
}

export function GPSForm({ index }: GPSFormProps) {
  const { control } = useFormContext();
  const namePrefix = `${GPS_FIELDS.BASE}.${index}`;
  const gpsTrackingStatus = useWatch({ control, name: `${namePrefix}.${GPS_FIELDS.GPS_TRACKING_STATUS}` });

  return (
    <div className="p-4 border rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSwitchField
          control={control}
          name={`${namePrefix}.${GPS_FIELDS.GPS_TRACKING_STATUS}`}
          label="GPS Takip Cihazı Var mı?"
        />
      </div>

      {gpsTrackingStatus && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormInput control={control} name={`${namePrefix}.${GPS_FIELDS.BRAND}`} label="Marka" required />
          <FormInput control={control} name={`${namePrefix}.${GPS_FIELDS.DEVICE_MODEL}`} label="Cihaz Modeli" required />
          <FormInput control={control} name={`${namePrefix}.${GPS_FIELDS.INSTALLATION_DATE}`} label="Montaj Tarihi" type="date" required />
          <FormInput control={control} name={`${namePrefix}.${GPS_FIELDS.SIM_NUMBER}`} label="SIM Kart No" required />
        </div>
      )}

      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value={`additional-info-${index}`}>
          <AccordionTrigger>Ek Bilgiler (Opsiyonel)</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <FormInput control={control} name={`${namePrefix}.${GPS_FIELDS.DEVICE_SERIAL_NUMBER}`} label="Seri Numarası" />
              <FormInput control={control} name={`${namePrefix}.${GPS_FIELDS.SERVICE_PROVIDER}`} label="Servis Sağlayıcı" />
              <FormInput control={control} name={`${namePrefix}.${GPS_FIELDS.SUBSCRIPTION_START}`} label="Abonelik Başlangıç" type="date" />
              <FormInput control={control} name={`${namePrefix}.${GPS_FIELDS.SUBSCRIPTION_END}`} label="Abonelik Bitiş" type="date" />
              <FormInput control={control} name={`${namePrefix}.${GPS_FIELDS.INSTALLATION_LOCATION}`} label="Montaj Lokasyonu" />
              <FormInput control={control} name={`${namePrefix}.${GPS_FIELDS.DESCRIPTION}`} label="Açıklama" />
              <FormSwitchField
                control={control}
                name={`${namePrefix}.${GPS_FIELDS.IS_ACTIVE}`}
                label="Durum"
                labelPlacement='left'
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
