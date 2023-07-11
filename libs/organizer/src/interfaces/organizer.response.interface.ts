export interface JsonOrganizerProps {
  id: string;
  name: string;
  profile: string;
  background: string;
  email_address: string;
  is_locked: boolean;
  is_active: boolean;
  created_at: number; // unix
  updated_at: number; // unix
  user_id: string;
}
