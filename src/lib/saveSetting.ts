import { supabase } from "@/integrations/supabase/client";

export const saveSetting = (key: string, value: string, userId?: string) =>
  supabase.from("site_settings").upsert({ setting_key: key, setting_value: value, updated_by: userId }, { onConflict: "setting_key" });
