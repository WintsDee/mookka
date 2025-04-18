
import { useQuery } from "@tanstack/react-query";
import { MediaType } from "@/types";
import { fetchMediaDetails, fetchSimilarMedia, fetchTrending, searchMedia } from "@/services/media";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Durée du cache en millisecondes
const CACHE_TIME = 1000 * 60 * 10; // 10 minutes

/**
 * Hook pour rechercher des médias avec mise en cache
 */
export function useSearchMedia(type: MediaType, query: string) {
  const { toast } = useToast();
  const queryResult = useQuery({
    queryKey: ['search', type, query],
    queryFn: () => searchMedia(type, query),
    enabled: !!type && query.length > 2,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (queryResult.error) {
      console.error(`Erreur lors de la recherche pour ${type}:`, queryResult.error);
      toast({
        title: "Erreur de recherche",
        description: "Impossible de récupérer les résultats de recherche",
        variant: "destructive",
      });
    }
  }, [queryResult.error, toast, type]);

  return queryResult;
}

/**
 * Hook pour récupérer les détails d'un média avec mise en cache
 */
export function useMediaDetails(type: MediaType, id: string) {
  const { toast } = useToast();
  const queryResult = useQuery({
    queryKey: ['media', type, id],
    queryFn: () => fetchMediaDetails(type, id),
    enabled: !!type && !!id,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (queryResult.error) {
      console.error(`Erreur lors du chargement des détails pour ${type} ${id}:`, queryResult.error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de récupérer les détails de ce média",
        variant: "destructive",
      });
    }
  }, [queryResult.error, toast, type, id]);

  return queryResult;
}

/**
 * Hook pour récupérer les médias similaires avec mise en cache
 */
export function useSimilarMedia(type: MediaType, id: string) {
  const { toast } = useToast();
  const queryResult = useQuery({
    queryKey: ['media', 'similar', type, id],
    queryFn: () => fetchSimilarMedia(type, id),
    enabled: !!type && !!id,
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (queryResult.error) {
      console.error(`Erreur lors du chargement des médias similaires pour ${type} ${id}:`, queryResult.error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de récupérer les médias similaires",
        variant: "destructive",
      });
    }
  }, [queryResult.error, toast, type, id]);

  return queryResult;
}

/**
 * Hook pour récupérer les médias tendance avec mise en cache
 */
export function useTrendingMedia(type: MediaType) {
  const { toast } = useToast();
  const queryResult = useQuery({
    queryKey: ['trending', type],
    queryFn: () => fetchTrending(type),
    staleTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (queryResult.error) {
      console.error(`Erreur lors du chargement des médias tendance pour ${type}:`, queryResult.error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de récupérer les médias tendance",
        variant: "destructive",
      });
    }
  }, [queryResult.error, toast, type]);

  return queryResult;
}
