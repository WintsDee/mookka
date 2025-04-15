
import React, { useState, useEffect } from "react";
import { MediaType } from "@/types";
import { SerieProgression } from "@/components/media-detail/progression/serie-progression";
import { FilmProgression } from "@/components/media-detail/progression/film-progression";
import { BookProgression } from "@/components/media-detail/progression/book-progression";
import { GameProgression } from "@/components/media-detail/progression/game-progression";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface ProgressionTabProps {
  mediaId: string;
  mediaType: MediaType;
  mediaDetails: any;
}

export function ProgressionTab({ mediaId, mediaType, mediaDetails }: ProgressionTabProps) {
  const [loading, setLoading] = useState(true);
  const [progression, setProgression] = useState<any>(null);
  const { toast } = useToast();
  const [localProgressions, setLocalProgressions] = useLocalStorage<Record<string, any>>('media-progressions', {});

  // Récupérer les données de progression soit de Supabase soit du stockage local
  useEffect(() => {
    const fetchProgression = async () => {
      setLoading(true);
      try {
        // Essayer d'abord de récupérer depuis Supabase si l'utilisateur est connecté
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('media_progressions')
            .select('*')
            .eq('media_id', mediaId)
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (error && error.code !== 'PGRST116') {
            console.error("Erreur lors de la récupération de la progression:", error);
          }
          
          if (data) {
            setProgression(data.progression_data);
            return;
          }
        }
        
        // Si pas de données Supabase, utiliser le stockage local
        const localData = localProgressions[mediaId];
        if (localData) {
          setProgression(localData);
        } else {
          // Initialiser une progression vide selon le type de média
          let initialProgression = {};
          
          if (mediaType === 'serie' && mediaDetails?.seasons) {
            initialProgression = {
              watched_episodes: {},
              total_episodes: 0,
              watched_count: 0,
              status: 'to-watch'
            };
          } else if (mediaType === 'film') {
            initialProgression = {
              watched: false,
              watch_time: 0,
              status: 'to-watch'
            };
          } else if (mediaType === 'book') {
            initialProgression = {
              current_page: 0,
              total_pages: mediaDetails?.pages || 0,
              status: 'to-read'
            };
          } else if (mediaType === 'game') {
            initialProgression = {
              completion_percentage: 0,
              playtime: 0,
              status: 'to-play'
            };
          }
          
          setProgression(initialProgression);
        }
      } catch (error) {
        console.error("Erreur:", error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les données de progression",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProgression();
  }, [mediaId, mediaType, localProgressions, toast, mediaDetails]);

  // Fonction pour mettre à jour la progression
  const updateProgression = async (newProgressionData: any) => {
    try {
      setProgression(newProgressionData);
      
      // Essayer de sauvegarder dans Supabase si l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('media_progressions')
          .upsert({
            user_id: user.id,
            media_id: mediaId,
            progression_data: newProgressionData,
            updated_at: new Date().toISOString()
          });
          
        if (error) {
          console.error("Erreur lors de la sauvegarde de la progression:", error);
          throw error;
        }
      } 
      
      // Toujours sauvegarder localement en cas de déconnexion
      setLocalProgressions({
        ...localProgressions,
        [mediaId]: newProgressionData
      });
      
      // Toast de confirmation supprimé
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la progression",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement de votre progression...</span>
      </div>
    );
  }

  // Render le composant approprié selon le type de média
  return (
    <div className="space-y-6">
      {mediaType === 'serie' && (
        <SerieProgression 
          mediaDetails={mediaDetails} 
          progression={progression} 
          onUpdate={updateProgression}
        />
      )}
      
      {mediaType === 'film' && (
        <FilmProgression 
          mediaDetails={mediaDetails} 
          progression={progression} 
          onUpdate={updateProgression}
        />
      )}
      
      {mediaType === 'book' && (
        <BookProgression 
          mediaDetails={mediaDetails} 
          progression={progression} 
          onUpdate={updateProgression}
        />
      )}
      
      {mediaType === 'game' && (
        <GameProgression 
          mediaDetails={mediaDetails} 
          progression={progression} 
          onUpdate={updateProgression}
        />
      )}
    </div>
  );
}
