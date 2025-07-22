export interface Utts {
  id?: number;
  vehicle_id?: number;
  purchase_date: Date | string | null;
  installation_date: Date | string | null;
  utts_code: string;
}

export const NEW_UTTS_RECORD: Utts = {
  id: undefined,
  vehicle_id: undefined,
  purchase_date: null,
  installation_date: null,
  utts_code: '',
};

export const UTTS_MESSAGES = {
  EDIT: 'UTTS Düzenle',
  NEW: 'Yeni UTTS Ekle',
  DELETE_TITLE: 'UTTS Kaydını Sil',
  DELETE_MESSAGE: 'Bu UTTS kaydını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
  CANCEL: 'İptal',
  DELETE: 'Sil',
};
