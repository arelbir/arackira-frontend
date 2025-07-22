curl -X 'GET' \
  'http://localhost:4000/api/vehicles/11/with-related' \
  -H 'accept: application/json'


  {
  "data": {
    "id": 11,
    "plate_number": "34ABC124777",
    "chassis_number": "XYZ123446789",
    "branch_id": 1,
    "version": null,
    "package": null,
    "vehicle_group_id": 1,
    "body_type": null,
    "engine_power_hp": null,
    "engine_volume_cc": null,
    "engine_number": "ENG987634321",
    "first_registration_date": "2025-07-06T21:00:00.000Z",
    "registration_document_number": null,
    "vehicle_responsible_id": 1,
    "vehicle_km": 25000,
    "next_maintenance_date": null,
    "inspection_expiry_date": null,
    "insurance_expiry_date": null,
    "casco_expiry_date": null,
    "exhaust_stamp_expiry_date": null,
    "brand_id": 2,
    "fuel_type_id": 3,
    "model_year": 2022,
    "vehicle_type_id": 2,
    "model_id": 3,
    "transmission_id": null,
    "color_id": 5,
    "vehicle_status_id": 2,
    "is_draft": false,
    "tsb_code": "1112222",
    "supplier_id": 2,
    "purchase_price": "3333.00",
    "invoice_date": "2025-07-14T21:00:00.000Z"
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
        "start_date": null,
        "end_date": null,
        "total_amount": "165.00",
        "currency": null,
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
        "inspection_date": "2025-05-13T21:00:00.000Z",
        "expiry_date": "2025-05-13T21:00:00.000Z",
        "result": "1",
        "description": "sorunsuz",
        "cost": null,
        "created_at": "2025-05-23T20:25:21.982Z",
        "updated_at": "2025-07-22T09:27:49.062Z"
      }
    ],
    "utts": [
      {
        "id": 1,
        "vehicle_id": 11,
        "purchase_date": "2025-06-21T21:00:00.000Z",
        "installation_date": "2025-06-21T21:00:00.000Z",
        "utts_code": "asdasdasd123123",
        "created_at": "2025-06-23T10:13:03.181Z",
        "updated_at": "2025-07-22T09:27:49.196Z"
      }
    ],
    "hgs": [
      {
        "id": 2,
        "vehicle_id": 11,
        "hgs_place": "Ankara",
        "hgs_tag_no": "12354",
        "hgs_vehicle_class": "1",
        "is_active": true
      },
      {
        "id": 5,
        "vehicle_id": 11,
        "hgs_place": "Bursa",
        "hgs_tag_no": "55334",
        "hgs_vehicle_class": "2",
        "is_active": true
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
      },
      {
        "id": 2,
        "vehicle_id": 11,
        "gps_tracking_status": false,
        "brand": "asdads",
        "installation_date": "2025-07-22T21:00:00.000Z",
        "sim_number": "123123",
        "device_model": "23123",
        "device_serial_number": "2312323",
        "subscription_start": "2025-07-21T21:00:00.000Z",
        "subscription_end": "2025-07-23T21:00:00.000Z",
        "service_provider": "12312",
        "description": "asdasd",
        "is_active": true,
        "last_update": "2025-07-21T21:00:00.000Z",
        "installation_location": "Bursa",
        "cancellation_date": "2025-07-21T21:00:00.000Z",
        "created_at": "2025-07-21T19:41:23.302Z",
        "updated_at": "2025-07-21T19:41:23.302Z"
      }
    ]
  }
}



curl --location --request PUT 'http://localhost:4000/api/vehicles/11/with-related' \
--header 'accept: application/json' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoidGVzdHVzZXIyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzUzMTgzMTY3LCJleHAiOjE3NTMyMTE5Njd9.OAaEp2VgHuCJ2mv4eOFlCyBrHRRQ-qK7iZ7RPNnlf18' \
--data '{
    "vehicle": {
      "id": 11,
      "plate_number": "34ABC124777",
      "chassis_number": "XYZ123446789",
      "branch_id": 1,
      "version": null,
      "package": null,
      "vehicle_group_id": 1,
      "body_type": null,
      "engine_power_hp": null,
      "engine_volume_cc": null,
      "engine_number": "ENG987634321",
      "first_registration_date": "2025-07-07T21:00:00.000Z",
      "registration_document_number": null,
      "vehicle_responsible_id": 1,
      "vehicle_km": 25000,
      "next_maintenance_date": null,
      "inspection_expiry_date": null,
      "insurance_expiry_date": null,
      "casco_expiry_date": null,
      "exhaust_stamp_expiry_date": null,
      "brand_id": 2,
      "fuel_type_id": 3,
      "model_year": 2022,
      "vehicle_type_id": 2,
      "model_id": 3,
      "transmission_id": null,
      "color_id": 5,
      "vehicle_status_id": 2,
      "is_draft": false,
      "tsb_code": "1112222",
      "supplier_id": 2,
      "purchase_price": "3333.00",
      "invoice_date": "2025-07-15T21:00:00.000Z"
    },
    "insurances": [
      {
        "id": 2,
        "vehicle_id": 11,
        "insurance_type_id": 1,
        "insurance_company_id": 1,
        "policy_number": "12345232",
        "tramer": "0",
        "start_date": null,
        "end_date": null,
        "total_amount": "165.00",
        "currency": null,
        "description": "string"
      }
    ],
    "inspections": [
      {
        "id": 1,
        "vehicle_id": 11,
        "inspection_company_id": 1,
        "inspection_company_name": "Tüvtürk Beykoz",
        "inspection_date": "2025-05-14T21:00:00.000Z",
        "expiry_date": "2025-05-14T21:00:00.000Z",
        "result": "1",
        "description": "sorunsuz",
        "cost": null
      }
    ],
    "utts": [
      {
        "id": 1,
        "vehicle_id": 11,
        "purchase_date": "2025-06-22T21:00:00.000Z",
        "installation_date": "2025-06-22T21:00:00.000Z",
        "utts_code": "asdasdasd123123"
      }
    ],
    "hgs": [
      {
        "id": 2,
        "vehicle_id": 11,
        "hgs_place": "Ankara",
        "hgs_tag_no": "12354",
        "hgs_vehicle_class": "1",
        "is_active": true
      },
      {
        "id": 5,
        "vehicle_id": 11,
        "hgs_place": "Bursa",
        "hgs_tag_no": "55334",
        "hgs_vehicle_class": "2",
        "is_active": true
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
        "cancellation_date": "2027-03-29T21:00:00.000Z"
      },
      {
        "id": 2,
        "vehicle_id": 11,
        "gps_tracking_status": false,
        "brand": "asdads",
        "installation_date": "2025-07-22T21:00:00.000Z",
        "sim_number": "123123",
        "device_model": "23123",
        "device_serial_number": "2312323",
        "subscription_start": "2025-07-21T21:00:00.000Z",
        "subscription_end": "2025-07-23T21:00:00.000Z",
        "service_provider": "12312",
        "description": "asdasd",
        "is_active": true,
        "last_update": "2025-07-21T21:00:00.000Z",
        "installation_location": "Bursa",
        "cancellation_date": "2025-07-21T21:00:00.000Z"
      }
    ]
  }'