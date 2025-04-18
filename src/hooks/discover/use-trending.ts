
import { useState, useCallback } from "react";
import { searchMedia } from "@/services/media";
import { toast } from "@/components/ui/sonner";
import { TrendingMedia, MediaType } from "./types";

export function useTrending() {
  const [trendingMedia, setTrendingMedia] = useState<TrendingMedia[]>([
    { type: "film", items: [], loading: true },
    { type: "serie", items: [], loading: true }, 
    { type: "book", items: [], loading: true },
    { type: "game", items: [], loading: true }
  ]);

  const loadTrendingMedia = useCallback(async () => {
    const mediaTypes: MediaType[] = ["film", "serie", "book", "game"];
    
    try {
      // Marquer tous les types comme étant en cours de chargement
      setTrendingMedia(prev => 
        prev.map(item => ({ ...item, loading: true }))
      );
      
      // Charger les données pour chaque type en parallèle
      const promises = mediaTypes.map(async (type) => {
        try {
          console.log(`Fetching trending for ${type}...`);
          const { results } = await searchMedia(type, "trending");
          console.log(`Received ${results?.length || 0} ${type} results`);
          
          return { 
            type, 
            items: results?.slice(0, 8) || [],
            loading: false 
          };
        } catch (error) {
          console.error(`Erreur lors du chargement des tendances pour ${type}:`, error);
          return { 
            type, 
            items: [],
            loading: false 
          };
        }
      });
      
      // Attendre que toutes les requêtes soient terminées
      const results = await Promise.all(promises);
      
      // Mettre à jour l'état avec les résultats
      setTrendingMedia(results);
    } catch (error) {
      console.error("Erreur générale lors du chargement des tendances:", error);
      toast.error("Impossible de charger les tendances");
      
      // En cas d'erreur générale, marquer tous les types comme non chargés
      setTrendingMedia(prev => 
        prev.map(item => ({ ...item, loading: false }))
      );
    }
  }, []);

  return {
    trendingMedia,
    loadTrendingMedia
  };
}
