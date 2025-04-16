
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { MediaType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { FilmProgression } from "@/components/media-detail/progression/film-progression";
import { SerieProgression } from "@/components/media-detail/progression/serie-progression";
import { BookProgression } from "@/components/media-detail/progression/book-progression";
import { GameProgression } from "@/components/media-detail/progression/game-progression";
import { useProfile } from "@/hooks/use-profile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProgressionTabProps {
  mediaId: string;
  mediaType: MediaType;
  mediaDetails: any;
}

export function ProgressionTab({ mediaId, mediaType, mediaDetails }: ProgressionTabProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progression, setProgression] = useState<any>(null);
  const { isAuthenticated } = useProfile();

  // Utiliser cette fonction pour créer une progression par défaut selon le type de média
  const createDefaultProgression = (type: MediaType) => {
    switch (type) {
      case 'film':
        return {
          status: 'to-watch',
          watched_time: 0
        };
      case 'serie':
        return {
          status: 'to-watch',
          watched_episodes: {},
          watched_count: 0,
          total_episodes: 0
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
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('media_progressions')
        .select('progression_data')
        .eq('media_id', mediaId)
        .eq('user_id', user.user.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération de la progression:', error);
      }
      
      // Si aucune progression n'est trouvée, créer une progression par défaut
      if (!data || !data.progression_data) {
        const defaultProgression = createDefaultProgression(mediaType);
        setProgression(defaultProgression);
      } else {
        setProgression(data.progression_data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la progression:', error);
      // En cas d'erreur, utiliser une progression par défaut
      const defaultProgression = createDefaultProgression(mediaType);
      setProgression(defaultProgression);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProgression();
  }, [mediaId, isAuthenticated, mediaType]);

  const handleProgressionUpdate = async (progressionData: any) => {
    if (!isAuthenticated) return;
    
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Afficher un message si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Vous devez être connecté pour suivre votre progression</h3>
          <p className="text-muted-foreground mb-4">Connectez-vous pour enregistrer votre progression sur ce média.</p>
          <Button>Se connecter</Button>
        </CardContent>
      </Card>
    );
  }

  const renderProgressionComponent = () => {
    switch (mediaType) {
      case 'film':
        return (
          <FilmProgression 
            mediaDetails={mediaDetails}
            progression={progression}
            onUpdate={handleProgressionUpdate}
          />
        );
      case 'serie':
        return (
          <SerieProgression 
            mediaDetails={mediaDetails}
            progression={progression}
            onUpdate={handleProgressionUpdate}
          />
        );
      case 'book':
        return (
          <BookProgression 
            mediaDetails={mediaDetails}
            progression={progression}
            onUpdate={handleProgressionUpdate}
          />
        );
      case 'game':
        return (
          <GameProgression 
            mediaDetails={mediaDetails}
            progression={progression}
            onUpdate={handleProgressionUpdate}
          />
        );
      default:
        return <p>Type de média non pris en charge</p>;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-4">Suivi de progression</h2>
      {renderProgressionComponent()}
    </div>
  );
}
