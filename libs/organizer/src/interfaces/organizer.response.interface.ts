export interface JsonOrganizerProps {
  id: string;
  name: string;
  username: string;
  profile: string | null;
  background: string | null;
  email_address: string;
  is_locked: boolean;
  is_active: boolean;
  is_favorite: boolean;
  created_at: number; // unix
  updated_at: number; // unix
  logout_at: number | null; // unix
  user_id: string;
}
