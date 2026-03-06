import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Location {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  listing_count: number;
  sort_order: number;
  active: boolean;
}

export const useLocations = () =>
  useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return (data || []) as Location[];
    },
  });

export const useAllLocations = () =>
  useQuery({
    queryKey: ["locations_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("locations")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data || []) as Location[];
    },
  });
