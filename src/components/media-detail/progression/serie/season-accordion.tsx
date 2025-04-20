
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Season } from "./types/serie-progression";

interface SeasonAccordionProps {
  season: Season;
  watchedEpisodes: number[];
  onToggleSeason: () => void;
  onExpandSeason: () => void;
  expanded: boolean;
}

export function SeasonAccordion({ 
  season,
  watchedEpisodes,
  onToggleSeason,
  onExpandSeason,
  expanded
}: SeasonAccordionProps) {
  if (!season) {
    return null;
  }
  
  const seasonNumber = season.season_number;
  const episodeCount = season.episode_count;
  const seasonName = season.name || `Saison ${seasonNumber}`;
  const seasonDate = formatSeasonDate(season.air_date);
  const isSeasonWatched = watchedEpisodes.length === episodeCount;
  
  const handleToggleSeason = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSeason();
  };

  const formatSeasonDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Format en français
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="cursor-pointer" onClick={onExpandSeason}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isSeasonWatched}
            onCheckedChange={(checked) => {
              if (checked !== 'indeterminate') {
                onToggleSeason();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="h-5 w-5"
          />
          <div>
            <h3 className="text-base font-medium">{seasonName}</h3>
            {seasonDate && (
              <p className="text-sm text-muted-foreground">
                {seasonDate}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {watchedEpisodes.length}/{episodeCount} épisodes
          </span>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>
      <Progress 
        value={(watchedEpisodes.length / episodeCount) * 100} 
        className="h-1.5 bg-secondary/30"
      />
    </div>
  );
}
