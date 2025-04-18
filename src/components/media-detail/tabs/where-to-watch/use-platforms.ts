
import { useState, useEffect } from 'react';
import { MediaType } from "@/types";
import { Platform, PlatformHookResult } from "./types";
import { generatePlatformData } from "./platform-data";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

// Timeout duration in milliseconds
const FETCH_TIMEOUT = 5000;
// Cache duration in milliseconds
const CACHE_TIME = 1000 * 60 * 60; // 1 hour

/**
 * Récupère les plateformes pour un média avec mise en cache via React Query
 */
export function usePlatforms(mediaId: string, mediaType: MediaType, title: string): PlatformHookResult {
  const { toast } = useToast();

  // Fonction pour récupérer les plateformes
  const fetchPlatformsData = async (): Promise<Platform[]> => {
    return new Promise((resolve, reject) => {
      // Créer un timeout pour éviter les requêtes trop longues
      const timeoutId = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, FETCH_TIMEOUT);

      try {
        // Simuler une requête API
        setTimeout(() => {
          clearTimeout(timeoutId);
          const mockPlatforms = generatePlatformData(mediaId, mediaType, title);
          resolve(mockPlatforms);
        }, 500); // Temps réduit pour une meilleure expérience
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  };

  // Utiliser React Query pour la mise en cache
  const { data: platforms = [], isLoading, error } = useQuery({
    queryKey: ['platforms', mediaType, mediaId],
    queryFn: fetchPlatformsData,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Une erreur s'est produite lors de la récupération des plateformes";
      
      console.error("Erreur lors de la récupération des plateformes:", error);
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  // Retourner l'état enrichi
  return { 
    platforms, 
    isLoading, 
    error: error ? (error instanceof Error ? error.message : "Erreur inconnue") : null,
    // Helper functions
    availablePlatforms: platforms.filter(platform => platform.isAvailable === true),
    hasAvailablePlatforms: platforms.some(platform => platform.isAvailable === true)
  };
}

// Export the types for backward compatibility
export type { Platform } from './types';
