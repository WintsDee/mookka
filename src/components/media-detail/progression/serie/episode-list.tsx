
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isValid, isAfter, isBefore, addDays } from 'date-fns';
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
      const date = parseISO(dateString);
      if (!isValid(date)) return '';
      
      const now = new Date();
      if (isAfter(date, now)) {
        return `À venir (${format(date, 'dd/MM/yyyy', { locale: fr })})`;
      }
      
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", error);
      return '';
    }
  };
  
  const validWatchedEpisodes = Array.isArray(watchedEpisodes) ? watchedEpisodes : [];
  
  const twoWeeksAgo = addDays(new Date(), -14);
  const today = new Date();
  
  return (
    <div className="divide-y divide-border/20">
      {episodes.map(episode => {
        const episodeNumber = episode.number;
        const isWatched = validWatchedEpisodes.includes(episodeNumber);
        const airDate = episode.airDate ? parseISO(episode.airDate) : null;
        const isRecent = airDate && isValid(airDate) && isAfter(airDate, twoWeeksAgo) && isBefore(airDate, today);
        const isUpcoming = airDate && isValid(airDate) && isAfter(airDate, today);
        
        return (
          <div key={`s${seasonNumber}e${episodeNumber}`} className="flex items-center p-3 border-b last:border-b-0 border-border/30">
            <Checkbox 
              id={`s${seasonNumber}e${episodeNumber}`}
              checked={isWatched}
              onCheckedChange={() => onToggleEpisode(seasonNumber, episodeNumber)}
              className="mr-3 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
              disabled={isUpcoming}
            />
            <div className="flex-1">
              <label 
                htmlFor={`s${seasonNumber}e${episodeNumber}`}
                className={`flex-1 cursor-pointer font-medium ${isUpcoming ? 'text-muted-foreground' : ''}`}
              >
                Épisode {episodeNumber} {episode.title ? `- ${episode.title}` : ''}
              </label>
              
              {episode.airDate && (
                <div className="text-xs text-muted-foreground mt-1">
                  {formatAirDate(episode.airDate)}
                </div>
              )}
            </div>
            
            {isRecent && (
              <Badge variant="outline" className="ml-2 bg-purple-500/10 text-purple-500 border-purple-500/20">
                Nouveau
              </Badge>
            )}
            
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
