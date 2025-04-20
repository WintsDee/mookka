
import { useState, useEffect } from "react";
import { MediaType, MediaStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export function useProgression(mediaId: string, mediaType: MediaType, mediaDetails: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [progression, setProgression] = useState<any>(null);

  // Create a default progression based on media type
  const createDefaultProgression = (type: MediaType) => {
    // Assign correct default status based on media type
    let defaultStatus: MediaStatus;
    
    switch (type) {
      case 'film':
      case 'serie':
        defaultStatus = 'to-watch';
        break;
      case 'book':
        defaultStatus = 'to-read';
        break;
      case 'game':
        defaultStatus = 'to-play';
        break;
      default:
        defaultStatus = 'to-watch';
    }
    
    switch (type) {
      case 'film':
        return {
          status: defaultStatus,
          watched_time: 0
        };
      case 'serie':
        return {
          status: defaultStatus,
          watched_episodes: {},
          watched_count: 0,
          total_episodes: 0
        };
      case 'book':
        return {
          status: defaultStatus,
          current_page: 0,
          total_pages: mediaDetails?.page_count || 0
        };
      case 'game':
        return {
          status: defaultStatus,
          completion_percentage: 0,
          playtime: 0
        };
      default:
        return {};
    }
  };
  
  const fetchProgression = async () => {
    try {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      // Create a default progression regardless of user status
      const defaultProgression = createDefaultProgression(mediaType);
      
      if (user.user) {
        const { data, error } = await supabase
          .from('media_progressions')
          .select('progression_data')
          .eq('media_id', mediaId)
          .eq('user_id', user.user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Erreur lors de la récupération de la progression:', error);
        }
        
        // If progression data exists, use it; otherwise use default
        if (data && data.progression_data) {
          setProgression(data.progression_data);
        } else {
          setProgression(defaultProgression);
        }
      } else {
        // Use default progression if no user
        setProgression(defaultProgression);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la progression:', error);
      // In case of error, use default progression
      const defaultProgression = createDefaultProgression(mediaType);
      setProgression(defaultProgression);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProgression();
  }, [mediaId, mediaType]);

  const handleProgressionUpdate = async (progressionData: any) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) return;
      
      const { data: existingProgression } = await supabase
        .from('media_progressions')
        .select('id')
        .eq('media_id', mediaId)
        .eq('user_id', user.user.id)
        .maybeSingle();
      
      if (existingProgression) {
        await supabase
          .from('media_progressions')
          .update({
            progression_data: progressionData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingProgression.id);
      } else {
        await supabase
          .from('media_progressions')
          .insert({
            media_id: mediaId,
            user_id: user.user.id,
            progression_data: progressionData
          });
      }
      
      setProgression(progressionData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la progression:', error);
    }
  };

  return {
    isLoading,
    progression,
    handleProgressionUpdate,
    createDefaultProgression
  };
}
