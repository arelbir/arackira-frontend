// Kiralama formu için Zod şeması
import * as z from 'zod';

export const rentalSchema = z.object({
  vehicle_id: z.number().min(1, 'Araç seçilmeli'),
  client_company_id: z.number().min(1, 'Şirket ID girilmeli'),
  contract_number: z.string().min(1, 'Sözleşme numarası zorunlu'),
  start_date: z.string().min(1, 'Başlangıç tarihi zorunlu'),
  end_date: z.string().min(1, 'Bitiş tarihi zorunlu'),
  terms: z.string().optional(),
  status: z.string().min(1, 'Durum zorunlu')
});

export type RentalFormValues = z.infer<typeof rentalSchema>;
