export interface Contract {
  id: number;
  contract_number: string;
  client_id: number;
  vehicle_id: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'terminated';
  // Diğer gerekli alanlar buraya eklenecek
}

export interface ContractsResponse {
  data: Contract[];
  total: number;
  page: number;
  limit: number;
}
