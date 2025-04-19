
import React from "react";
import { ProgressHeader } from "./serie/progress-header";
import { StatusSelector } from "./serie/status-selector";
import { SeasonAccordion } from "./serie/season-accordion";
import { UpcomingEpisodes } from "./serie/upcoming-episodes";
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
    upcomingEpisodes,
    totalEpisodes,
    watchedEpisodes,
    status,
    progression: updatedProgression,
    toggleEpisode,
    toggleSeason,
    updateStatus
  } = useSerieProgression(mediaDetails, progression);

  const handleEpisodeToggle = (seasonNumber: number, episodeNumber: number) => {
    const updated = toggleEpisode(seasonNumber, episodeNumber);
    onUpdate(updated);
  };

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
        status={status}
        onStatusChange={handleStatusChange}
      />

      <ProgressHeader
        watchedCount={watchedEpisodes}
        totalCount={totalEpisodes}
      />

      <div className="space-y-4">
        {upcomingEpisodes.length > 0 && (
          <UpcomingEpisodes episodes={upcomingEpisodes} />
        )}

        <SeasonAccordion
          seasons={seasons}
          progression={updatedProgression}
          onToggleEpisode={handleEpisodeToggle}
          onToggleSeason={handleSeasonToggle}
        />
        
        <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4 mt-4">
          <NotesTextarea 
            notes={updatedProgression?.notes || ""} 
            onNotesChange={handleNotesChange}
            placeholder="Notez vos impressions sur cette série, les épisodes marquants, etc."
          />
        </div>
      </div>
    </div>
  );
}
