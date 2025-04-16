
import { useState, useEffect } from 'react';
import { MediaType } from "@/types";
import { Platform, PlatformHookResult } from "./types";
import { generatePlatformData } from "./platform-data";
import { useToast } from "@/components/ui/use-toast";

// Timeout duration in milliseconds
const FETCH_TIMEOUT = 5000;

export function usePlatforms(mediaId: string, mediaType: MediaType, title: string): PlatformHookResult {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Reset states when inputs change
    setPlatforms([]);
    setIsLoading(true);
    setError(null);
    
    // Function to fetch platforms where to watch/buy the media
    const fetchPlatforms = async () => {
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
          }, 1000);
        });
        
        // Race between the data fetch and the timeout
        const data = await Promise.race([dataPromise, timeoutPromise]);
        
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
    };
    
    // Execute the fetch function
    fetchPlatforms();
  }, [mediaId, mediaType, title, toast]);

  // Return enhanced result object
  return { 
    platforms, 
    isLoading, 
    error,
    // Helper function to get only available platforms
    availablePlatforms: platforms.filter(platform => platform.isAvailable === true),
    // Flag indicating if any platforms are available
    hasAvailablePlatforms: platforms.some(platform => platform.isAvailable === true)
  };
}

// Export the types for backward compatibility
export type { Platform } from './types';
