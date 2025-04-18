
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useTrending = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { data: trending = [], isLoading: loading, refetch } = useQuery({
    queryKey: ["trending"],
    queryFn: async () => {
      try {
        console.log("Fetching trending media");
        const { data, error } = await supabase.functions.invoke("fetch-media", {
          body: { 
            type: "trending",
            categories: ["film", "serie", "game", "book"]
          }
        });
        
        if (error) {
          console.error("Error fetching trending media:", error);
          throw error;
        }
        
        console.log("Trending data received:", data);
        return data.results || [];
      } catch (err) {
        console.error("Failed to fetch trending media:", err);
        throw err;
      }
    }
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {
    trending,
    loading,
    refreshing,
    handleRefresh
  };
};
