
import { supabase } from "@/integrations/supabase/client";
import { MediaStatus, MediaType } from "@/types";

export interface MediaLibraryStats {
  totalCount: number;
  byType: {
    [key in MediaType]: number;
  };
  byStatus: {
    [key in MediaStatus]: number;
  };
  recentlyAdded: number;
  recentlyUpdated: number;
  highestRated: number;
}

export async function getUserMediaLibraryStats(): Promise<MediaLibraryStats> {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error("User not authenticated");
    }
    
    // Get count by type
    const { data: typeData, error: typeError } = await supabase
      .from('user_media')
      .select(`
        media:media_id (
          type
        )
      `)
      .eq('user_id', user.user.id);
      
    if (typeError) {
      console.error("Error fetching library stats by type:", typeError);
      throw typeError;
    }
    
    // Get count by status
    const { data: statusData, error: statusError } = await supabase
      .from('user_media')
      .select('status')
      .eq('user_id', user.user.id);
      
    if (statusError) {
      console.error("Error fetching library stats by status:", statusError);
      throw statusError;
    }
    
    // Get recently added (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: recentlyAdded, error: recentError } = await supabase
      .from('user_media')
      .select('id', { count: 'exact' })
      .eq('user_id', user.user.id)
      .gte('added_at', thirtyDaysAgo.toISOString());
      
    if (recentError) {
      console.error("Error fetching recently added count:", recentError);
      throw recentError;
    }
    
    // Get recently updated (last 30 days)
    const { count: recentlyUpdated, error: updatedError } = await supabase
      .from('user_media')
      .select('id', { count: 'exact' })
      .eq('user_id', user.user.id)
      .gte('updated_at', thirtyDaysAgo.toISOString())
      .neq('added_at', 'updated_at');
      
    if (updatedError) {
      console.error("Error fetching recently updated count:", updatedError);
      throw updatedError;
    }
    
    // Get highest rated count (rating >= 8)
    const { count: highestRated, error: ratedError } = await supabase
      .from('user_media')
      .select('id', { count: 'exact' })
      .eq('user_id', user.user.id)
      .gte('user_rating', 8);
      
    if (ratedError) {
      console.error("Error fetching highest rated count:", ratedError);
      throw ratedError;
    }
    
    // Calculate totals by type
    const typeCount = {
      film: 0,
      serie: 0,
      book: 0,
      game: 0
    };
    
    typeData.forEach(item => {
      const type = item.media?.type as MediaType;
      if (type && type in typeCount) {
        typeCount[type]++;
      }
    });
    
    // Calculate totals by status
    const statusCount: Record<MediaStatus, number> = {
      'to-watch': 0,
      'watching': 0,
      'completed': 0,
      'to-read': 0,
      'reading': 0,
      'to-play': 0,
      'playing': 0
    };
    
    statusData.forEach(item => {
      const status = item.status as MediaStatus;
      if (status && status in statusCount) {
        statusCount[status]++;
      }
    });
    
    return {
      totalCount: typeData.length,
      byType: typeCount,
      byStatus: statusCount,
      recentlyAdded: recentlyAdded || 0,
      recentlyUpdated: recentlyUpdated || 0,
      highestRated: highestRated || 0
    };
  } catch (error) {
    console.error("Error in getUserMediaLibraryStats:", error);
    throw error;
  }
}
