
import { MediaType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetche les détails d'un média depuis l'API
 */
export const fetchMediaDetails = async (type: MediaType, id: string) => {
  try {
    console.log(`Fetching details for ${type} ${id}...`);
    
    // Appel à la function Edge pour récupérer les détails
    const { data, error } = await supabase.functions.invoke('fetch-media', {
      body: { type, id },
    });

    if (error) {
      console.error("Error fetching media details:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from API");
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ${type} details:`, error);
    throw error;
  }
};

/**
 * Récupère les médias similaires ou recommandés
 */
export const fetchSimilarMedia = async (type: MediaType, id: string) => {
  try {
    // Appel à la function Edge pour récupérer les médias similaires
    const { data, error } = await supabase.functions.invoke('fetch-media', {
      body: { type, id, action: 'similar' },
    });

    if (error) {
      console.error("Error fetching similar media:", error);
      throw error;
    }

    return data?.similar || [];
  } catch (error) {
    console.error(`Error fetching similar ${type}:`, error);
    return [];
  }
};

/**
 * Récupère les médias par critères de recherche
 */
export const searchMedia = async (params: {
  type: MediaType;
  query: string;
  page?: number;
}) => {
  try {
    const { type, query, page = 1 } = params;
    
    // Appel à la function Edge pour la recherche
    const { data, error } = await supabase.functions.invoke('fetch-media', {
      body: { type, query, page, action: 'search' },
    });

    if (error) {
      console.error("Error searching media:", error);
      throw error;
    }

    return {
      results: data?.results || [],
      totalPages: data?.total_pages || 0,
      totalResults: data?.total_results || 0
    };
  } catch (error) {
    console.error("Error in search media:", error);
    return { results: [], totalPages: 0, totalResults: 0 };
  }
};

/**
 * Récupère les médias tendance
 */
export const fetchTrending = async (type: MediaType) => {
  try {
    console.log(`Fetching trending for ${type}...`);
    
    // Appel à la function Edge
    const { data, error } = await supabase.functions.invoke('fetch-media', {
      body: { type, action: 'trending' },
    });

    if (error) {
      console.error(`Error fetching trending ${type}:`, error);
      throw error;
    }

    // Filtrer les médias sans titre ou image
    const validMedia = (data?.results || []).filter(
      (item: any) => item.title || item.name || item.original_title || item.original_name
    );

    console.log(`Received ${validMedia.length} ${type} results`);
    return validMedia;
  } catch (error) {
    console.error(`Error fetching trending ${type}:`, error);
    return [];
  }
};

// Re-export des fonctions spécifiques pour la rétrocompatibilité
export * from './media/filters';
export * from './media/formatters';
export * from './media/library';
export * from './media/search-service';
export * from './media/social-service';
export * from './media/suggestion-service';
