
import React from "react";
import { ProgressHeader } from "./serie/progress-header";
import { StatusSelector } from "./serie/status-selector";
import { SeasonAccordion } from "./serie/season-accordion";
import { useSerieProgression } from "./serie/use-serie-progression";
import { NotesTextarea } from "./notes-textarea";

interface SerieProgressionProps {
  mediaDetails: any;
  progression: any;
  onUpdate: (progression: any) => void;
}

export function SerieProgression({ mediaDetails, progression, onUpdate }: SerieProgressionProps) {
  const {
    seasons,
    totalEpisodes,
    watchedEpisodes,
    status,
    progression: updatedProgression,
    toggleSeason,
    updateStatus
  } = useSerieProgression(mediaDetails, progression);

  const handleSeasonToggle = (seasonNumber: number, episodeCount: number) => {
    const updated = toggleSeason(seasonNumber, episodeCount);
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

      <SeasonAccordion
        seasons={seasons}
        progression={updatedProgression}
        onToggleSeason={handleSeasonToggle}
      />
        
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
