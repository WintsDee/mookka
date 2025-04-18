
import { MediaType } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export interface DiscoverySection {
  id: string;
  title: string;
  type: 'trending' | 'new' | 'upcoming' | 'recommended' | 'genre' | 'popular';
  mediaType?: MediaType;
  genre?: string;
  items: any[];
}

export async function fetchDiscoverySections(): Promise<DiscoverySection[]> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-discover');
    
    if (error) {
      console.error("Error fetching discovery sections:", error);
      return [];
    }
    
    // Process the sections to ensure all media items have the required fields
    const processedSections = data.sections ? data.sections.map((section: DiscoverySection) => ({
      ...section,
      items: section.items.map(item => formatMediaItem(item))
    })) : [];
    
    return processedSections;
  } catch (error) {
    console.error("Error in fetchDiscoverySections:", error);
    return [];
  }
}

export async function fetchTrendingMedia(type?: MediaType | 'all'): Promise<any[]> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-discover/trending', {
      body: { type: type === 'all' ? undefined : type }
    });
    
    if (error) {
      console.error("Error fetching trending media:", error);
      return [];
    }
    
    return data.media ? data.media.map(formatMediaItem) : [];
  } catch (error) {
    console.error("Error in fetchTrendingMedia:", error);
    return [];
  }
}

export async function fetchUpcomingMedia(type?: MediaType | 'all'): Promise<any[]> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-discover/upcoming', {
      body: { type: type === 'all' ? undefined : type }
    });
    
    if (error) {
      console.error("Error fetching upcoming media:", error);
      return [];
    }
    
    return data.media ? data.media.map(formatMediaItem) : [];
  } catch (error) {
    console.error("Error in fetchUpcomingMedia:", error);
    return [];
  }
}

export async function fetchRecommendedMedia(userId?: string, mediaType?: MediaType | 'all'): Promise<any[]> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-discover/recommended', {
      body: { userId, mediaType: mediaType === 'all' ? undefined : mediaType }
    });
    
    if (error) {
      console.error("Error fetching recommended media:", error);
      return [];
    }
    
    return data.media ? data.media.map(formatMediaItem) : [];
  } catch (error) {
    console.error("Error in fetchRecommendedMedia:", error);
    return [];
  }
}

// Helper function to ensure media items have all required fields
function formatMediaItem(item: any): any {
  return {
    id: item.id?.toString() || `item-${Math.random().toString(36).substring(7)}`,
    title: item.title || item.name || "Titre inconnu",
    type: item.type || "film",
    coverImage: item.coverImage || item.poster_path || item.background_image || "/placeholder.svg",
    year: item.year || (item.release_date ? item.release_date.substring(0, 4) : null) || 
          (item.released ? item.released.substring(0, 4) : null) || 
          (item.first_air_date ? item.first_air_date.substring(0, 4) : null),
    rating: item.rating || item.vote_average || null,
    genres: Array.isArray(item.genres) ? 
      (item.genres.map((g: any) => typeof g === 'string' ? g : g.name)) : 
      [],
    description: item.description || item.overview || "",
    // Additional media-specific fields
    ...(item.type === 'book' && { author: item.author }),
    ...(item.type === 'film' && { director: item.director, duration: item.duration || item.runtime }),
    ...(item.type === 'game' && { platform: item.platform, publisher: item.publisher }),
    ...item // Keep any other fields from the original item
  };
}
