
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
    
    return data.sections || [];
  } catch (error) {
    console.error("Error in fetchDiscoverySections:", error);
    return [];
  }
}

export async function fetchTrendingMedia(type?: MediaType): Promise<any[]> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-discover/trending', {
      body: { type }
    });
    
    if (error) {
      console.error("Error fetching trending media:", error);
      return [];
    }
    
    return data.media || [];
  } catch (error) {
    console.error("Error in fetchTrendingMedia:", error);
    return [];
  }
}

export async function fetchUpcomingMedia(type?: MediaType): Promise<any[]> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-discover/upcoming', {
      body: { type }
    });
    
    if (error) {
      console.error("Error fetching upcoming media:", error);
      return [];
    }
    
    return data.media || [];
  } catch (error) {
    console.error("Error in fetchUpcomingMedia:", error);
    return [];
  }
}

export async function fetchRecommendedMedia(userId?: string, mediaType?: MediaType): Promise<any[]> {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-discover/recommended', {
      body: { userId, mediaType }
    });
    
    if (error) {
      console.error("Error fetching recommended media:", error);
      return [];
    }
    
    return data.media || [];
  } catch (error) {
    console.error("Error in fetchRecommendedMedia:", error);
    return [];
  }
}
