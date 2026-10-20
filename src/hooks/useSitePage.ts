import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const EDITABLE_PAGES = [
  { slug: "about", title: "About Us" },
  { slug: "services", title: "Our Services" },
  { slug: "privacy-policy", title: "Privacy Policy" },
  { slug: "terms-conditions", title: "Terms & Conditions" },
];

export const useSitePage = (slug: string) =>
  useQuery({
    queryKey: ["site_page", slug],
    queryFn: async () => {
      const { data } = await supabase.from("site_pages").select("*").eq("slug", slug).maybeSingle();
      return data;
    },
    staleTime: 60_000,
  });
