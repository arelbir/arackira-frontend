// UI mesajları için sabitler
export const INSURANCE_MESSAGES = {
  SUCCESS: "Sigorta kaydı başarıyla kaydedildi",
  ERROR: "Sigorta kaydı oluşturulurken bir hata oluştu",
  DELETE_SUCCESS: "Sigorta kaydı başarıyla silindi",
  NEW: "Yeni Sigorta Kaydı",
  EDIT: "Sigorta Kaydını Düzenle",
  DELETE: "Sil",
  DELETE_TITLE: "Sigorta Kaydını Sil",
  DELETE_CONFIRM: "Bu sigorta kaydını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
  RENEW: "Sigorta kaydı yenilendi",
};

// Yeni sigorta kaydı için varsayılan değerler
// Bu yapı, `insuranceSchema` ile uyumlu olmalıdır.
export const NEW_INSURANCE_RECORD = {
  insurance_type_id: null,
  insurance_company_id: null,
  policy_number: '',
  tramer: '',
  start_date: null,
  end_date: null,
  total_amount: 0,
  currency: 'TRY', // Varsayılan para birimi
  description: '',
};

