
import { useQuery } from "@tanstack/react-query";
import { Media } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface DiscoveryResponse {
  films: Media[];
  series: Media[];
  books: Media[];
  games: Media[];
  isLoading: boolean;
  error: Error | null;
}

export function useDiscoveryMedia(): DiscoveryResponse {
  const { data: films = [], isLoading: isLoadingFilms } = useQuery({
    queryKey: ['discovery', 'films'],
    queryFn: async () => {
      const { data: mediaData, error } = await supabase.functions.invoke('fetch-media', {
        body: { type: 'film', query: 'popular' }
      });
      
      if (error) throw error;
      return mediaData.results?.slice(0, 10) || [];
    }
  });

  const { data: series = [], isLoading: isLoadingSeries } = useQuery({
    queryKey: ['discovery', 'series'],
    queryFn: async () => {
      const { data: mediaData, error } = await supabase.functions.invoke('fetch-media', {
        body: { type: 'serie', query: 'popular' }
      });
      
      if (error) throw error;
      return mediaData.results?.slice(0, 10) || [];
    }
  });

  const { data: books = [], isLoading: isLoadingBooks } = useQuery({
    queryKey: ['discovery', 'books'],
    queryFn: async () => {
      const { data: mediaData, error } = await supabase.functions.invoke('fetch-media', {
        body: { type: 'book', query: 'popular' }
      });
      
      if (error) throw error;
      return mediaData.items?.slice(0, 10) || [];
    }
  });

  const { data: games = [], isLoading: isLoadingGames } = useQuery({
    queryKey: ['discovery', 'games'],
    queryFn: async () => {
      const { data: mediaData, error } = await supabase.functions.invoke('fetch-media', {
        body: { type: 'game', query: 'popular' }
      });
      
      if (error) throw error;
      return mediaData.results?.slice(0, 10) || [];
    }
  });

  const isLoading = isLoadingFilms || isLoadingSeries || isLoadingBooks || isLoadingGames;

  return {
    films,
    series,
    books,
    games,
    isLoading,
    error: null
  };
}
