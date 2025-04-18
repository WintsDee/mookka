
import React from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { EpisodeList } from "./episode-list";
import { Season } from "./types/serie-progression";

interface SeasonAccordionProps {
  seasons: Season[];
  progression: any;
  onToggleEpisode: (seasonNumber: number, episodeNumber: number) => void;
  onToggleSeason: (seasonNumber: number, episodeCount: number) => void;
}

export function SeasonAccordion({ 
  seasons, 
  progression, 
  onToggleEpisode, 
  onToggleSeason 
}: SeasonAccordionProps) {
  if (!seasons || seasons.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Aucune saison disponible
      </div>
    );
  }

  // Sort seasons by number
  const sortedSeasons = [...seasons].sort((a, b) => 
    (a.season_number || 0) - (b.season_number || 0)
  );

  const formatSeasonDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      // Format year only
      return date.getFullYear().toString();
    } catch (error) {
      return '';
    }
  };

  return (
    <Accordion type="multiple" className="w-full space-y-4">
      {sortedSeasons.map((season) => {
        const seasonNumber = season.season_number;
        const episodeCount = season.episode_count || 0;
        const seasonName = season.name || `Saison ${seasonNumber}`;
        const seasonDate = formatSeasonDate(season.air_date);
        const watchedEpisodesForSeason = progression?.watched_episodes?.[seasonNumber] || [];
        const seasonProgress = episodeCount > 0 ? (watchedEpisodesForSeason.length / episodeCount) * 100 : 0;
        
        // Ensure we have correct episode data for this season
        const seasonEpisodes = season.episodes || 
          Array.from({ length: episodeCount }, (_, i) => ({
            number: i + 1,
            title: `Épisode ${i + 1}`,
            airDate: undefined
          }));
        
        // Sort episodes by number
        const sortedEpisodes = [...seasonEpisodes].sort((a, b) => 
          (a.number || 0) - (b.number || 0)
        );
        
        // Determine toggle button text based on current state
        const isAllWatched = Array.isArray(watchedEpisodesForSeason) && 
          watchedEpisodesForSeason.length === episodeCount;
        const toggleButtonText = isAllWatched ? 'Tout décocher' : 'Tout cocher';
        
        return (
          <AccordionItem 
            key={`season-${seasonNumber}`} 
            value={`season-${seasonNumber}`}
            className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <span className="text-xl font-semibold">{seasonName}</span>
                    {seasonDate && (
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({seasonDate})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {Array.isArray(watchedEpisodesForSeason) ? watchedEpisodesForSeason.length : 0}/{episodeCount} épisodes
                    </span>
                    {episodeCount > 0 && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSeason(seasonNumber, episodeCount);
                        }}
                      >
                        {toggleButtonText}
                      </Button>
                    )}
                  </div>
                </div>
                <Progress 
                  value={seasonProgress} 
                  className="h-1.5 mt-2 bg-secondary/30"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-t border-border/30">
              {sortedEpisodes.length > 0 ? (
                <EpisodeList 
                  seasonNumber={seasonNumber} 
                  episodes={sortedEpisodes} 
                  watchedEpisodes={Array.isArray(watchedEpisodesForSeason) ? watchedEpisodesForSeason : []} 
                  onToggleEpisode={onToggleEpisode} 
                />
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  Aucun épisode disponible pour cette saison
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
