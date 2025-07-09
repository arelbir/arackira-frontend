// src/services/api.ts
// API client'i kullanarak uyumluluk için wrapper
import { apiFetch as newApiFetch } from '@/lib/api-client';

export const apiFetch = newApiFetch;

// Not: Bu dosya geriye dönük uyumluluk için kullanılıyor.
// Yeni servisler için doğrudan '@/lib/api-client' içinden apiRequest kullanın.

