
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTrending = () => {
  const { data: trending = [], isLoading: loading } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-media", {
        body: { 
          type: "trending",
          categories: ["film", "serie", "game", "book"]
        }
      });
      
      if (error) throw error;
      return data.results || [];
    }
  });

  return {
    trending,
    loading
  };
};
