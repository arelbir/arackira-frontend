/**
 * Backend için zorunlu alanların validasyon kuralları
 * Backend dokümantasyonundan alınmıştır
 */
export const REQUIRED_FIELDS = {
  vehicle: [
    'plate_number',
    'chassis_number',
    'branch_id',
    'vehicle_type_id',
    'brand_id',
    'model_id',
    'vehicle_status_id',
    'fuel_type_id',
    'transmission_id',
    'color_id'
  ],
  inspections: [
    'inspection_company_id',
    'expiry_date',
    'performed_by',
    'amount',
    'payment_type_id',
    'payment_account_id',
    'create_payment_record'
  ],
  utts: [
    'utts_code'
  ],
  hgs: [
    'loading_date',
    'amount',
    'payer_type_id'
  ],
  services: [
    'service_date',
    'exit_date',
    'service_type_id',
    'service_company_id',
    'vehicle_km',
    'amount',
    'payer_type_id',
    'vat_amount',
    'total_amount',
    'currency',
    'invoice_date',
    'due_date',
    'document_no',
    'payment_type_id',
    'payment_account_id',
    'create_payment_record'
  ]
};
