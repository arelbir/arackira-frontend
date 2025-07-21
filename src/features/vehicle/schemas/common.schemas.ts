// src/features/vehicle/schemas/common.schemas.ts
import { z } from 'zod';

/**
 * API'den string, boş string veya null olarak gelebilen bir değeri,
 * form işlemleri için number veya undefined'a dönüştürür.
 */
export const stringToNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
  z.number().optional().nullable()
);

/**
 * API'den string olarak gelen bir tarihi, Zod'un `coerce` özelliğiyle
 * doğrudan Date objesine veya null'a dönüştürür.
 */
export const stringToDate = z.coerce.date().nullable();
