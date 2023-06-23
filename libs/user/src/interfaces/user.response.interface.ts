export interface JsonUserProps {
  id: string;
  full_name: string;
  email_address: string;
  phone_number: string;
  is_active: boolean;
  created_at: number; // unix
  updated_at: number; // unix
}
