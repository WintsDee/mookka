
import { useState, useEffect, useCallback } from "react";
import { MediaType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";
import { updateMediaStatus } from "@/services/media";

// Cache client pour réduire les appels API
const progressionCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useProgression(mediaId: string, mediaType: MediaType, mediaDetails: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [progression, setProgression] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Create a default progression based on media type - memoized with useCallback
  const createDefaultProgression = useCallback((type: MediaType) => {
    switch (type) {
      case 'film':
        return {
          status: 'to-watch',
          watched_time: 0,
          total_time: mediaDetails?.runtime || 0
        };
      case 'serie':
        return {
          status: 'to-watch',
          watched_episodes: {},
          watched_count: 0,
          total_episodes: mediaDetails?.number_of_episodes || 0
        };
      case 'book':
        return {
          status: 'to-read',
          current_page: 0,
          total_pages: mediaDetails?.page_count || 0
        };
      case 'game':
        return {
          status: 'to-play',
          completion_percentage: 0,
          playtime: 0
        };
      default:
        return {};
    }
  }, [mediaDetails]);
  
  const fetchProgression = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Create a default progression
      const defaultProgression = createDefaultProgression(mediaType);
      
      if (!user) {
        setProgression(defaultProgression);
        setIsLoading(false);
        return;
      }
      
      // Vérifier le cache
      const cacheKey = `progression-${user.id}-${mediaId}`;
      const cachedData = progressionCache.get(cacheKey);
      
      if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
        setProgression(cachedData.data);
        setIsLoading(false);
        return;
      }
      
      // Si pas dans le cache, rechercher dans la BDD
      const { data, error } = await supabase
        .from('media_progressions')
        .select('progression_data')
        .eq('media_id', mediaId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération de la progression:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer votre progression",
          variant: "destructive"
        });
      }
      
      // If progression data exists, use it; otherwise use default
      let progressionData;
      if (data && data.progression_data) {
        progressionData = data.progression_data;
      } else {
        progressionData = defaultProgression;
      }
      
      // Mettre en cache
      progressionCache.set(cacheKey, {
        data: progressionData,
        timestamp: Date.now()
      });
      
      setProgression(progressionData);
    } catch (error) {
      console.error('Erreur lors de la récupération de la progression:', error);
      // In case of error, use default progression
      const defaultProgression = createDefaultProgression(mediaType);
      setProgression(defaultProgression);
    } finally {
      setIsLoading(false);
    }
  }, [mediaId, mediaType, user, createDefaultProgression, toast]);
  
  useEffect(() => {
    fetchProgression();
  }, [fetchProgression]);

  const handleProgressionUpdate = useCallback(async (progressionData: any) => {
    try {
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour enregistrer votre progression",
          variant: "destructive"
        });
        return;
      }
      
      // Mettre à jour le cache immédiatement pour une réactivité optimale
      const cacheKey = `progression-${user.id}-${mediaId}`;
      progressionCache.set(cacheKey, {
        data: progressionData,
        timestamp: Date.now()
      });
      
      // Mettre à jour l'interface immédiatement
      setProgression(progressionData);
      
      // Vérifier si il y a un enregistrement existant
      const { data: existingProgression } = await supabase
        .from('media_progressions')
        .select('id')
        .eq('media_id', mediaId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      // Mise à jour ou création de la progression
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
            user_id: user.id,
            progression_data: progressionData
          });
      }
      
      // Mettre à jour le statut dans user_media si approprié
      if (progressionData.status) {
        await updateMediaStatus(mediaId, progressionData.status);
      }
      
      toast({
        title: "Progression enregistrée",
        description: "Votre progression a été mise à jour"
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la progression:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre progression",
        variant: "destructive"
      });
    }
  }, [mediaId, user, toast]);

  return {
    isLoading,
    progression,
    handleProgressionUpdate,
    createDefaultProgression
  };
}
