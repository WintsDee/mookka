
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNewReleases = () => {
  const { data: releases = [], isLoading: loading } = useQuery({
    queryKey: ["new-releases"],
    queryFn: async () => {
      try {
        console.log("Fetching new releases");
        const { data, error } = await supabase.functions.invoke("fetch-media", {
          body: { 
            type: "new-releases",
            categories: ["film", "serie", "game", "book"]
          }
        });
        
        if (error) {
          console.error("Error fetching new releases:", error);
          throw error;
        }
        
        console.log("New releases data received:", data);
        return data.results || [];
      } catch (err) {
        console.error("Failed to fetch new releases:", err);
        throw err;
      }
    }
  });

  return {
    releases,
    loading
  };
};
