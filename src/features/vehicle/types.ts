import { z } from 'zod';

// ---------------------------
// Vehicle domain model & schema
// ---------------------------

export const VehicleSchema = z.object({
  id: z.number(),
  plate_number: z.string(),
  branch_id: z.number().nullable(),
  brand_id: z.number().nullable(),
  model_id: z.number().nullable(),
  vehicle_status_id: z.number().nullable(),
  model_year: z.number().nullable(),
  vehicle_km: z.number().nullable()
});

export type Vehicle = z.infer<typeof VehicleSchema>;

/*
#Mevcut GET http://localhost:4000/api/vehicles response body örneği.

[
  {
    "id": 147,
    "plate_number": "34ECE2421",
    "branch_id": 1,
    "vehicle_type_id": 1,
    "brand_id": 1,
    "model_id": 1,
    "version": null,
    "package": null,
    "vehicle_group_id": 2,
    "body_type": null,
    "fuel_type_id": 1,
    "transmission_id": 1,
    "model_year": 2022,
    "color_id": 1,
    "engine_power_hp": 231,
    "engine_volume_cc": 2312,
    "chassis_number": "231312312332",
    "engine_number": "123",
    "first_registration_date": "2025-05-24T21:00:00.000Z",
    "registration_document_number": "23231",
    "vehicle_responsible_id": null,
    "vehicle_km": 2,
    "next_maintenance_date": "2025-05-30T21:00:00.000Z",
    "inspection_expiry_date": "2025-05-24T21:00:00.000Z",
    "insurance_expiry_date": null,
    "casco_expiry_date": "2025-05-24T21:00:00.000Z",
    "exhaust_stamp_expiry_date": "2025-05-24T21:00:00.000Z",
    "vehicle_status_id": 1,
    "tsb_code": null,
    "is_draft": false
  },
  {
    "id": 11,
    "plate_number": "34ABC124",
    "branch_id": 1,
    "vehicle_type_id": 2,
    "brand_id": 1,
    "model_id": 1,
    "version": "1.6 Vision",
    "package": "Comfort",
    "vehicle_group_id": 1,
    "body_type": "Sedan",
    "fuel_type_id": 1,
    "transmission_id": 2,
    "model_year": 2022,
    "color_id": 1,
    "engine_power_hp": 132,
    "engine_volume_cc": 1598,
    "chassis_number": "XYZ123446789",
    "engine_number": "ENG987634321",
    "first_registration_date": "2022-03-14T21:00:00.000Z",
    "registration_document_number": "REG20220401",
    "vehicle_responsible_id": 1,
    "vehicle_km": 25000,
    "next_maintenance_date": "2025-07-31T21:00:00.000Z",
    "inspection_expiry_date": "2026-03-14T21:00:00.000Z",
    "insurance_expiry_date": "2025-12-30T21:00:00.000Z",
    "casco_expiry_date": "2025-12-30T21:00:00.000Z",
    "exhaust_stamp_expiry_date": "2026-03-14T21:00:00.000Z",
    "vehicle_status_id": 1,
    "tsb_code": null,
    "is_draft": false
  }
]
*/