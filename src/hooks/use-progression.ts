
import { useState, useEffect, useCallback, useRef } from "react";
import { MediaType, MediaStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { updateMediaStatus } from "@/services/media";

export function useProgression(mediaId: string, mediaType: MediaType, mediaDetails: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [progression, setProgression] = useState<any>(null);
  const [userMediaStatus, setUserMediaStatus] = useState<MediaStatus | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Create a default progression based on media type
  const createDefaultProgression = useCallback((type: MediaType) => {
    let defaultStatus: MediaStatus;
    
    switch (type) {
      case 'film':
        defaultStatus = 'to-watch';
        return {
          status: defaultStatus,
          watched_time: 0,
          notes: ''
        };
      case 'serie':
        defaultStatus = 'to-watch';
        return {
          status: defaultStatus,
          watched_episodes: {},
          watched_count: 0,
          total_episodes: 0,
          notes: ''
        };
      case 'book':
        defaultStatus = 'to-read';
        return {
          status: defaultStatus,
          current_page: 0,
          total_pages: mediaDetails?.page_count || 0,
          notes: ''
        };
      case 'game':
        defaultStatus = 'to-play';
        return {
          status: defaultStatus,
          completion_percentage: 0,
          playtime: 0,
          notes: ''
        };
      default:
        defaultStatus = 'to-watch' as MediaStatus;
        return {
          status: defaultStatus
        };
    }
  }, [mediaDetails]);
  
  // Fetch user_media status to ensure consistency
  const fetchUserMediaStatus = useCallback(async () => {
    if (!mountedRef.current) return null;
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user || !mountedRef.current) return null;
      
      const { data, error } = await supabase
        .from('user_media')
        .select('status')
        .eq('media_id', mediaId)
        .eq('user_id', user.user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération du statut:', error);
        return null;
      }
      
      return data?.status as MediaStatus | null;
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      return null;
    }
  }, [mediaId]);
  
  const fetchProgression = useCallback(async () => {
    if (!mountedRef.current) return;
    
    try {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      // Get user media status first for consistency
      const status = await fetchUserMediaStatus();
      if (mountedRef.current) {
        setUserMediaStatus(status);
      }
      
      // Create a default progression regardless of user status
      const defaultProgression = createDefaultProgression(mediaType);
      
      if (user.user && mountedRef.current) {
        const { data, error } = await supabase
          .from('media_progressions')
          .select('progression_data')
          .eq('media_id', mediaId)
          .eq('user_id', user.user.id)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Erreur lors de la récupération de la progression:', error);
        }
        
        if (mountedRef.current) {
          // If progression data exists, use it, but ensure status is consistent with user_media
          if (data && data.progression_data) {
            const progressionData = data.progression_data;
            
            // If we have a status from user_media and it's different from progression status, update progression
            if (status && typeof progressionData === 'object' && progressionData !== null) {
              // Check if progressionData has a status property and fix it if needed
              if ('status' in progressionData && progressionData.status !== status) {
                progressionData.status = status;
              }
            }
            
            setProgression(progressionData);
          } else {
            // Use default progression if no data, but use status from user_media if available
            if (status && defaultProgression && typeof defaultProgression === 'object') {
              defaultProgression.status = status;
            }
            setProgression(defaultProgression);
          }
        }
      } else if (mountedRef.current) {
        // Use default progression if no user
        setProgression(defaultProgression);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la progression:', error);
      // In case of error, use default progression
      if (mountedRef.current) {
        const defaultProgression = createDefaultProgression(mediaType);
        setProgression(defaultProgression);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [mediaId, mediaType, fetchUserMediaStatus, createDefaultProgression]);
  
  useEffect(() => {
    if (mediaId && mediaType) {
      fetchProgression();
    }
  }, [fetchProgression, mediaId, mediaType]);

  const handleProgressionUpdate = useCallback(async (progressionData: any) => {
    if (!mountedRef.current) return;
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user || !mountedRef.current) return;
      
      console.log('Mise à jour de la progression:', progressionData);
      
      // If progressionData has a status property and it's different from userMediaStatus
      if (progressionData && 'status' in progressionData && progressionData.status !== userMediaStatus) {
        const newStatus = progressionData.status as MediaStatus;
        console.log(`Mise à jour du statut: ${userMediaStatus} -> ${newStatus}`);
        await updateMediaStatus(mediaId, newStatus);
        if (mountedRef.current) {
          setUserMediaStatus(newStatus);
        }
      }
      
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
      
      if (mountedRef.current) {
        setProgression(progressionData);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la progression:', error);
    }
  }, [mediaId, userMediaStatus]);

  return {
    isLoading,
    progression,
    userMediaStatus,
    handleProgressionUpdate,
    createDefaultProgression
  };
}
