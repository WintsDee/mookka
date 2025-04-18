
import { useState, useCallback } from "react";
import { searchMedia } from "@/services/media";
import { toast } from "@/components/ui/sonner";
import { Media } from "@/types";

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Media[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  const loadRecommendations = useCallback(async () => {
    try {
      setRecommendationsLoading(true);
      const { results } = await searchMedia("film", "recommandé");
      setRecommendations(results?.slice(0, 12) || []);
    } catch (error) {
      console.error("Erreur lors du chargement des recommandations:", error);
      toast.error("Impossible de charger les recommandations");
    } finally {
      setRecommendationsLoading(false);
    }
  }, []);

  return {
    recommendations,
    recommendationsLoading,
    loadRecommendations
  };
}
