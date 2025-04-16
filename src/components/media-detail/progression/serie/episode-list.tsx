
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface EpisodeListProps {
  seasonNumber: number;
  episodeCount: number;
  watchedEpisodes: number[];
  onToggleEpisode: (seasonNumber: number, episodeNumber: number) => void;
}

export function EpisodeList({ 
  seasonNumber, 
  episodeCount, 
  watchedEpisodes, 
  onToggleEpisode 
}: EpisodeListProps) {
  const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);
  
  return (
    <div className="divide-y divide-border/20">
      {episodes.map(episodeNumber => {
        const isWatched = watchedEpisodes.includes(episodeNumber);
        
        return (
          <div key={`s${seasonNumber}e${episodeNumber}`} className="flex items-center p-3 border-b last:border-b-0 border-border/30">
            <Checkbox 
              id={`s${seasonNumber}e${episodeNumber}`}
              checked={isWatched}
              onCheckedChange={() => onToggleEpisode(seasonNumber, episodeNumber)}
              className="mr-3 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <label 
              htmlFor={`s${seasonNumber}e${episodeNumber}`}
              className="flex-1 cursor-pointer font-medium"
            >
              Épisode {episodeNumber}
            </label>
          </div>
        );
      })}
    </div>
  );
}
