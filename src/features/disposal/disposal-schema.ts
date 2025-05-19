import * as z from 'zod';

export const disposalSchema = z.object({
  vehicle_id: z.number().min(1, 'Araç seçilmeli'),
  disposal_type: z.string().min(1, 'Tür seçilmeli'),
  disposal_date: z.string().min(1, 'Tarih zorunlu'),
  amount: z.number().optional(),
  notes: z.string().optional()
});

export type DisposalFormValues = z.infer<typeof disposalSchema>;

export interface DisposalRecord {
  id: number;
  vehicle_id: number;
  disposal_type: string;
  disposal_date: string;
  amount?: number;
  notes?: string;
  created_at?: string;
}
