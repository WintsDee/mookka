
import { useState, useEffect } from 'react';
import { MediaType } from "@/types";
import { Platform, PlatformHookResult } from "./types";
import { generatePlatformData } from "./platform-data";

export function usePlatforms(mediaId: string, mediaType: MediaType, title: string): PlatformHookResult {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fonction pour récupérer les plateformes où voir/acheter ce média
    const fetchPlatforms = async () => {
      setIsLoading(true);
      try {
        // Simulating API call with timeout
        setTimeout(() => {
          const mockPlatforms = generatePlatformData(mediaId, mediaType, title);
          // You could filter here if needed
          // mockPlatforms = mockPlatforms.filter(platform => platform.isAvailable === true);
          setPlatforms(mockPlatforms);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Erreur lors de la récupération des plateformes:", error);
        setIsLoading(false);
      }
    };
    
    fetchPlatforms();
  }, [mediaId, mediaType, title]);

  return { platforms, isLoading };
}

// Export the types for backward compatibility
export type { Platform } from './types';
