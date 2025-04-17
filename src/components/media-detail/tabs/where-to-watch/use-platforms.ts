
import { useState, useEffect, useCallback } from 'react';
import { MediaType } from "@/types";
import { Platform, PlatformHookResult } from "./types";
import { generatePlatformData } from "./platform-data";
import { useToast } from "@/components/ui/use-toast";

// Timeout duration in milliseconds
const FETCH_TIMEOUT = 5000;

// Cache pour améliorer les performances
const platformsCache = new Map<string, { data: Platform[], timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

export function usePlatforms(mediaId: string, mediaType: MediaType, title: string): PlatformHookResult {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Extraction de la fonction de fetch dans un useCallback
  const fetchPlatforms = useCallback(async () => {
    // Vérifier le cache
    const cacheKey = `${mediaType}-${mediaId}-${title}`;
    const cachedData = platformsCache.get(cacheKey);
    
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
      setPlatforms(cachedData.data);
      setIsLoading(false);
      return;
    }
    
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timed out'));
      }, FETCH_TIMEOUT);
    });
    
    try {
      // Simulate API call with timeout protection
      const dataPromise = new Promise<Platform[]>((resolve) => {
        setTimeout(() => {
          const mockPlatforms = generatePlatformData(mediaId, mediaType, title);
          resolve(mockPlatforms);
        }, 300); // Réduction du délai pour meilleure réactivité
      });
      
      // Race between the data fetch and the timeout
      const data = await Promise.race([dataPromise, timeoutPromise]);
      
      // Mise en cache des résultats
      platformsCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      // Filter available platforms if needed
      // const availablePlatforms = data.filter(platform => platform.isAvailable === true);
      setPlatforms(data);
      setIsLoading(false);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Une erreur s'est produite lors de la récupération des plateformes";
      
      console.error("Erreur lors de la récupération des plateformes:", error);
      setError(errorMessage);
      setIsLoading(false);
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [mediaId, mediaType, title, toast]);

  useEffect(() => {
    // Reset states when inputs change
    setPlatforms([]);
    setIsLoading(true);
    setError(null);
    
    // Execute the fetch function
    fetchPlatforms();
  }, [fetchPlatforms]);

  // Mémoriser les plateformes disponibles pour éviter les recalculs
  const availablePlatforms = platforms.filter(platform => platform.isAvailable === true);
  const hasAvailablePlatforms = availablePlatforms.length > 0;

  // Return enhanced result object
  return { 
    platforms, 
    isLoading, 
    error,
    // Helper function to get only available platforms
    availablePlatforms,
    // Flag indicating if any platforms are available
    hasAvailablePlatforms
  };
}

// Export the types for backward compatibility
export type { Platform } from './types';
