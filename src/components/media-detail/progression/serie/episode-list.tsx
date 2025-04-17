
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format, isAfter, isBefore, addDays } from 'date-fns';
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
      if (isAfter(date, new Date())) {
        return formatDistanceToNow(date, { addSuffix: true, locale: fr });
      }
      
      // Sinon on affiche la date au format DD/MM/YYYY
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error);
      return '';
    }
  };
  
  // Make sure we have a valid watchedEpisodes array
  const validWatchedEpisodes = Array.isArray(watchedEpisodes) ? watchedEpisodes : [];
  
  // Déterminer les épisodes récents (sortis dans les 14 derniers jours)
  const twoWeeksAgo = addDays(new Date(), -14);
  const today = new Date();
  
  console.log('EpisodeList rendering:', { seasonNumber, episodes, watchedEpisodes: validWatchedEpisodes });
  
  return (
    <div className="divide-y divide-border/20">
      {episodes.map(episode => {
        const episodeNumber = episode.number;
        const isWatched = validWatchedEpisodes.includes(episodeNumber);
        
        // Parse air date properly
        let airDate: Date | null = null;
        if (episode.airDate) {
          try {
            airDate = new Date(episode.airDate);
            if (isNaN(airDate.getTime())) {
              airDate = null;
            }
          } catch (error) {
            airDate = null;
          }
        }
        
        const isRecent = airDate && isAfter(airDate, twoWeeksAgo) && isBefore(airDate, today);
        const isUpcoming = airDate && isAfter(airDate, today);
        
        return (
          <div key={`s${seasonNumber}e${episodeNumber}`} className="flex items-center p-3 border-b last:border-b-0 border-border/30">
            <Checkbox 
              id={`s${seasonNumber}e${episodeNumber}`}
              checked={isWatched}
              onCheckedChange={() => {
                console.log(`Toggle episode ${episodeNumber} of season ${seasonNumber}, current state: ${isWatched}`);
                onToggleEpisode(seasonNumber, episodeNumber);
              }}
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
            {isRecent && (
              <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-500 border-purple-500/20">
                Nouveau
              </Badge>
            )}
            
            {/* Badge pour les épisodes à venir */}
            {isUpcoming && (
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
