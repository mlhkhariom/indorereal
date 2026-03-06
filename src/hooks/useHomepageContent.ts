import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HomepageItem {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  icon: string | null;
  sort_order: number;
  extra_data: Record<string, any>;
}

const fetchSection = async (section: string): Promise<HomepageItem[]> => {
  const { data, error } = await supabase
    .from("homepage_content")
    .select("*")
    .eq("section", section)
    .order("sort_order");
  if (error) throw error;
  return (data || []) as unknown as HomepageItem[];
};

export const useHomepageSection = (section: string) =>
  useQuery({
    queryKey: ["homepage_content", section],
    queryFn: () => fetchSection(section),
  });

export const useAllHomepageContent = () =>
  useQuery({
    queryKey: ["homepage_content_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .order("section")
        .order("sort_order");
      if (error) throw error;
      return (data || []) as unknown as HomepageItem[];
    },
  });
