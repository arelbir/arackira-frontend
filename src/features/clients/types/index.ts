export interface ClientAddress {
  id?: number;
  address_title: string;
  street: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
}

export interface ClientCompany {
  id: number;
  company_name: string;
  contact_person?: string;
  email: string;
  phone?: string;
  tax_office?: string;
  tax_id?: string;
  description?: string | null;
  parent_company_id?: number | null;
  client_type_id?: number | null;
  addresses?: ClientAddress[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ClientType {
  id: number;
  name: string;
  created_at?: string;
  deleted_at?: string | null;
}

export interface Client {
  id: number;
  client_type_id: number;
  company_id: number;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  created_at?: string;
  deleted_at?: string | null;
}

export interface PaginatedClientsResponse {
  data: ClientCompany[];
  total: number;
}

// Extends ClientCompany with subRows for hierarchical data structures used in tables.
export interface ClientCompanyWithSubRows extends ClientCompany {
  subRows?: ClientCompanyWithSubRows[];
}
