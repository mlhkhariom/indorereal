export interface Lead {
  id: string; name: string; phone: string; email: string | null; message: string | null;
  property_title: string | null; property_id?: string | null; status: string; source: string | null; created_at: string;
  assigned_to: string | null; follow_up_at: string | null; priority: string; budget: string | null;
  preferred_location: string | null; utm_source: string | null;
  property_type: string | null; bhk: string | null; purpose: string | null; lost_reason: string | null; last_contacted_at: string | null;
}
export interface Staff { user_id: string; email: string; role: string; }
export type UpdateLead = (id: string, patch: Partial<Lead>) => Promise<boolean>;
