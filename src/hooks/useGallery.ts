import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GalleryImage {
  id: string;
  title: string | null;
  category: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export const useGalleryImages = () =>
  useQuery({
    queryKey: ["gallery_images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data || []) as GalleryImage[];
    },
  });
