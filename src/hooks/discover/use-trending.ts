
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
    
    for (const type of mediaTypes) {
      try {
        // Mise à jour des indicateurs de chargement
        setTrendingMedia(prev => 
          prev.map(item => 
            item.type === type ? { ...item, loading: true } : item
          )
        );
        
        console.log(`Fetching trending for ${type}...`);
        const { results } = await searchMedia(type, "trending");
        console.log(`Received ${results?.length || 0} ${type} results`);
        
        // Make sure each item has the correct type set
        const typedResults = results?.map(item => ({
          ...item,
          type: type
        })) || [];
        
        setTrendingMedia(prev => 
          prev.map(item => 
            item.type === type ? { ...item, items: typedResults.slice(0, 8), loading: false } : item
          )
        );
      } catch (error) {
        console.error(`Erreur lors du chargement des tendances pour ${type}:`, error);
        setTrendingMedia(prev => 
          prev.map(item => 
            item.type === type ? { ...item, loading: false } : item
          )
        );
      }
    }
  }, []);

  return {
    trendingMedia,
    loadTrendingMedia
  };
}
