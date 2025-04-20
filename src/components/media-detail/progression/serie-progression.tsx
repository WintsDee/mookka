
import React, { useState } from "react";
import { ProgressHeader } from "./serie/progress-header";
import { StatusSelector } from "./serie/status-selector";
import { SeasonAccordion } from "./serie/season-accordion";
import { useSerieProgression } from "./serie/use-serie-progression";
import { NotesTextarea } from "./notes-textarea";
import { EpisodeList } from "./serie/episode-list";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SerieProgressionProps {
  mediaDetails: any;
  progression: any;
  onUpdate: (progression: any) => void;
}

export function SerieProgression({ mediaDetails, progression, onUpdate }: SerieProgressionProps) {
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  
  const {
    seasons,
    totalEpisodes,
    watchedEpisodes,
    status,
    progression: updatedProgression,
    toggleEpisode,
    toggleSeason,
    updateStatus
  } = useSerieProgression(mediaDetails, progression);

  const handleSeasonToggle = (seasonNumber: number, episodeCount: number) => {
    const updated = toggleSeason(seasonNumber, episodeCount);
    onUpdate(updated);
  };

  const handleEpisodeToggle = (seasonNumber: number, episodeNumber: number) => {
    const updated = toggleEpisode(seasonNumber, episodeNumber);
    onUpdate(updated);
  };

  const handleStatusChange = (newStatus: string) => {
    const updated = updateStatus(newStatus);
    onUpdate(updated);
  };
  
  const handleNotesChange = (notes: string) => {
    const updated = {
      ...updatedProgression,
      notes
    };
    onUpdate(updated);
  };

  const handleExpandSeason = (seasonNumber: number) => {
    setExpandedSeason(expandedSeason === seasonNumber ? null : seasonNumber);
  };

  return (
    <div className="space-y-6">
      <StatusSelector
        currentStatus={status}
        onStatusChange={handleStatusChange}
      />

      <ProgressHeader
        currentCount={watchedEpisodes}
        totalCount={totalEpisodes}
      />

      <div className="space-y-4">
        {seasons.map((season) => (
          <div key={`season-${season.season_number}`} className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-lg overflow-hidden">
            <SeasonAccordion
              season={season}
              watchedEpisodes={updatedProgression?.watched_episodes?.[season.season_number] || []}
              onToggleSeason={() => handleSeasonToggle(season.season_number, season.episode_count)}
              onExpandSeason={() => handleExpandSeason(season.season_number)}
              expanded={expandedSeason === season.season_number}
            />
            
            {expandedSeason === season.season_number && (
              <div className="px-4 pb-4 mt-2">
                <EpisodeList 
                  season={season}
                  watchedEpisodes={updatedProgression?.watched_episodes?.[season.season_number] || []}
                  onToggleEpisode={(episodeNumber) => handleEpisodeToggle(season.season_number, episodeNumber)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
        
      <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4 mt-4">
        <NotesTextarea 
          notes={updatedProgression?.notes || ""} 
          onNotesChange={handleNotesChange}
          placeholder="Notez vos impressions sur cette série, les saisons marquantes, etc."
        />
      </div>
    </div>
  );
}
