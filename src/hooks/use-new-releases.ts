
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useNewReleases = () => {
  const [refreshing, setRefreshing] = useState(false);

  const { data: releases = [], isLoading: loading, refetch } = useQuery({
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

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {
    releases,
    loading,
    refreshing,
    handleRefresh
  };
};
