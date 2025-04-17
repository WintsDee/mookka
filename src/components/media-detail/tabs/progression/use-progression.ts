
import { useState, useEffect } from "react";
import { MediaType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/auth-provider";

export function useProgression(mediaId: string, mediaType: MediaType, mediaDetails: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [progression, setProgression] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Create a default progression based on media type
  const createDefaultProgression = (type: MediaType) => {
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
  };
  
  const fetchProgression = async () => {
    try {
      setIsLoading(true);
      
      // Create a default progression
      const defaultProgression = createDefaultProgression(mediaType);
      
      if (!user) {
        setProgression(defaultProgression);
        return;
      }
      
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
      if (data && data.progression_data) {
        setProgression(data.progression_data);
      } else {
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
  }, [mediaId, mediaType, user]);

  const handleProgressionUpdate = async (progressionData: any) => {
    try {
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour enregistrer votre progression",
          variant: "destructive"
        });
        return;
      }
      
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
        await supabase
          .from('user_media')
          .update({ status: progressionData.status })
          .eq('media_id', mediaId)
          .eq('user_id', user.id);
      }
      
      setProgression(progressionData);
      
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
  };

  return {
    isLoading,
    progression,
    handleProgressionUpdate,
    createDefaultProgression
  };
}
