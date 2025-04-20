
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Season } from "./types/serie-progression";

interface EpisodeListProps {
  season: Season;
  watchedEpisodes: number[];
  onToggleEpisode: (episodeNumber: number) => void;
}

export function EpisodeList({ season, watchedEpisodes, onToggleEpisode }: EpisodeListProps) {
  const episodes = Array.from({ length: season.episode_count }, (_, i) => ({
    number: i + 1,
    title: `Épisode ${i + 1}`,
  }));

  return (
    <div className="space-y-2 mt-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {episodes.map((episode) => {
          const isWatched = watchedEpisodes.includes(episode.number);
          
          return (
            <div 
              key={`episode-${season.season_number}-${episode.number}`}
              className={`
                flex items-center gap-2 p-2 rounded-md border 
                ${isWatched ? 'bg-primary/10 border-primary/20' : 'bg-card/50 border-border/40'}
              `}
            >
              <Checkbox 
                checked={isWatched}
                onCheckedChange={() => onToggleEpisode(episode.number)}
                className="h-4 w-4"
              />
              <span className="text-sm truncate">{episode.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
