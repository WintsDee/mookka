
import { useQuery } from "@tanstack/react-query";
import { MediaType } from "@/types";
import { fetchMediaDetails, fetchSimilarMedia, fetchTrending } from "@/services/media";

// Durée du cache en millisecondes
const CACHE_TIME = 1000 * 60 * 10; // 10 minutes

/**
 * Hook pour récupérer les détails d'un média avec mise en cache
 */
export function useMediaDetails(type: MediaType, id: string) {
  return useQuery({
    queryKey: ['media', type, id],
    queryFn: () => fetchMediaDetails(type, id),
    enabled: !!type && !!id,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook pour récupérer les médias similaires avec mise en cache
 */
export function useSimilarMedia(type: MediaType, id: string) {
  return useQuery({
    queryKey: ['media', 'similar', type, id],
    queryFn: () => fetchSimilarMedia(type, id),
    enabled: !!type && !!id,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook pour récupérer les médias tendance avec mise en cache
 */
export function useTrendingMedia(type: MediaType) {
  return useQuery({
    queryKey: ['trending', type],
    queryFn: () => fetchTrending(type),
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
}
