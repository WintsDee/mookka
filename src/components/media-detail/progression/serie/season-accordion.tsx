
import React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface Season {
  season_number: number;
  name?: string;
  episode_count: number;
  air_date?: string;
}

interface SeasonAccordionProps {
  seasons: Season[];
  progression: any;
  onToggleSeason: (seasonNumber: number, episodeCount: number) => void;
}

export function SeasonAccordion({ 
  seasons, 
  progression, 
  onToggleSeason 
}: SeasonAccordionProps) {
  if (!seasons || seasons.length === 0) {
    return null;
  }

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
    <div className="space-y-2">
      {seasons.map((season) => {
        const seasonNumber = season.season_number;
        const episodeCount = season.episode_count;
        const seasonName = season.name || `Saison ${seasonNumber}`;
        const seasonDate = formatSeasonDate(season.air_date);
        const watchedEpisodesForSeason = progression?.watched_episodes?.[seasonNumber] || [];
        const isSeasonWatched = watchedEpisodesForSeason.length === episodeCount;
        
        return (
          <div 
            key={`season-${seasonNumber}`} 
            className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSeasonWatched}
                  onCheckedChange={() => onToggleSeason(seasonNumber, episodeCount)}
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
              <span className="text-sm text-muted-foreground">
                {watchedEpisodesForSeason.length}/{episodeCount} épisodes
              </span>
            </div>
            <Progress 
              value={(watchedEpisodesForSeason.length / episodeCount) * 100} 
              className="h-1.5 mt-3 bg-secondary/30"
            />
          </div>
        );
      })}
    </div>
  );
}
