
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Episode {
  number: number;
  title?: string;
  airDate?: string;
}

interface EpisodeListProps {
  seasonNumber: number;
  episodes: Episode[];
  watchedEpisodes: number[];
  onToggleEpisode: (seasonNumber: number, episodeNumber: number) => void;
}

export function EpisodeList({ 
  seasonNumber, 
  episodes, 
  watchedEpisodes, 
  onToggleEpisode 
}: EpisodeListProps) {
  const formatAirDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Si la date est dans le futur, on affiche "dans X jours/mois"
      if (date > new Date()) {
        return formatDistanceToNow(date, { addSuffix: true, locale: fr });
      }
      
      // Sinon on affiche la date au format DD/MM/YYYY
      return date.toLocaleDateString('fr-FR');
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error);
      return '';
    }
  };
  
  return (
    <div className="divide-y divide-border/20">
      {episodes.map(episode => {
        const episodeNumber = episode.number;
        const isWatched = watchedEpisodes.includes(episodeNumber);
        
        return (
          <div key={`s${seasonNumber}e${episodeNumber}`} className="flex items-center p-3 border-b last:border-b-0 border-border/30">
            <Checkbox 
              id={`s${seasonNumber}e${episodeNumber}`}
              checked={isWatched}
              onCheckedChange={() => onToggleEpisode(seasonNumber, episodeNumber)}
              className="mr-3 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <div className="flex-1">
              <label 
                htmlFor={`s${seasonNumber}e${episodeNumber}`}
                className="flex-1 cursor-pointer font-medium"
              >
                Épisode {episodeNumber} {episode.title ? `- ${episode.title}` : ''}
              </label>
              
              {episode.airDate && (
                <div className="text-xs text-muted-foreground mt-1">
                  {formatAirDate(episode.airDate)}
                </div>
              )}
            </div>
            
            {/* Badge pour les épisodes sortis récemment (moins de 14 jours) */}
            {episode.airDate && new Date(episode.airDate) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) && 
             new Date(episode.airDate) < new Date() && (
              <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-500 border-purple-500/20">
                Nouveau
              </Badge>
            )}
            
            {/* Badge pour les épisodes à venir */}
            {episode.airDate && new Date(episode.airDate) > new Date() && (
              <Badge variant="outline" className="ml-2 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                À venir
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
