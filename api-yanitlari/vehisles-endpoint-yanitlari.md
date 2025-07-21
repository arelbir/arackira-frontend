curl -X 'GET' \
  'http://localhost:4000/api/vehicles/11' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoidGVzdHVzZXIyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUzMTA1NTYyLCJleHAiOjE3NTMxMzQzNjJ9.2tcIOt2RIOYIr8amfFUPviGnagriIhtgvy26gvfSHwo'

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
  "body_type": "Sedan2",
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
  "tsb_code": "1111111",
  "is_draft": false,
  "supplier_id": 1,
  "purchase_price": "2.00",
  "invoice_date": "2025-07-13T21:00:00.000Z"
}


curl -X 'GET' \
  'http://localhost:4000/api/vehicles/11/complete' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoidGVzdHVzZXIyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUzMTA1NTYyLCJleHAiOjE3NTMxMzQzNjJ9.2tcIOt2RIOYIr8amfFUPviGnagriIhtgvy26gvfSHwo'

{
  "data": {
    "id": 11,
    "plate_number": "34ABC124",
    "branch_id": 1,
    "vehicle_type_id": 2,
    "brand_id": 1,
    "model_id": 1,
    "vehicle_group_id": 1,
    "fuel_type_id": 1,
    "model_year": 2022,
    "color_id": 1,
    "chassis_number": "XYZ123446789",
    "engine_number": "ENG987634321",
    "vehicle_responsible_id": 1,
    "vehicle_km": 25000,
    "vehicle_status_id": 1,
    "tsb_code": "1111111",
    "is_draft": false,
    "supplier_id": 1,
    "purchase_price": "2.00",
    "invoice_date": "2025-07-13T21:00:00.000Z"
  },
  "included": {
    "insurances": [
      {
        "id": 2,
        "vehicle_id": 11,
        "insurance_type_id": 1,
        "insurance_company_id": 1,
        "policy_number": "12345232",
        "tramer": "0",
        "start_date": "2025-05-22T21:00:00.000Z",
        "end_date": "2025-05-22T21:00:00.000Z",
        "total_amount": "165.00",
        "currency": "TL",
        "description": "string",
        "created_at": "2025-05-23T19:57:00.393Z"
      }
    ],
    "inspections": [
      {
        "id": 1,
        "vehicle_id": 11,
        "inspection_company_id": 1,
        "inspection_company_name": "Tüvtürk Beykoz",
        "inspection_date": "2025-05-22T21:00:00.000Z",
        "expiry_date": "2025-05-22T21:00:00.000Z",
        "result": "1",
        "description": "sorunsuz",
        "cost": "1234.00",
        "created_at": "2025-05-23T20:25:21.982Z",
        "updated_at": "2025-05-23T20:25:21.982Z"
      }
    ],
    "utts": [
      {
        "id": 1,
        "vehicle_id": 11,
        "purchase_date": "2025-06-22T21:00:00.000Z",
        "installation_date": "2025-06-22T21:00:00.000Z",
        "utts_code": "asdasdasd123123",
        "created_at": "2025-06-23T10:13:03.181Z",
        "updated_at": "2025-06-23T10:13:03.181Z"
      }
    ],
    "hgs": [
      {
        "id": 2,
        "vehicle_id": 11,
        "hgs_place": "asda",
        "hgs_tag_no": "sdasd",
        "hgs_vehicle_class": "1",
        "is_active": true,
        "created_at": "2025-06-15T18:44:31.334Z",
        "updated_at": "2025-06-15T18:44:31.334Z"
      }
    ],
    "gps": [
      {
        "id": 1,
        "vehicle_id": 11,
        "gps_tracking_status": true,
        "brand": "asdasd",
        "installation_date": "2025-07-14T21:00:00.000Z",
        "sim_number": "12312312",
        "device_model": "123123",
        "device_serial_number": "231231",
        "subscription_start": "2025-07-13T21:00:00.000Z",
        "subscription_end": "2025-07-08T21:00:00.000Z",
        "service_provider": "123123",
        "description": "aciklama örnek",
        "is_active": true,
        "last_update": "2025-07-21T21:00:00.000Z",
        "installation_location": "Ankara",
        "cancellation_date": "2027-03-29T21:00:00.000Z",
        "created_at": "2025-07-11T08:29:56.750Z",
        "updated_at": "2025-07-11T08:29:56.750Z"
      }
    ]
  }
}