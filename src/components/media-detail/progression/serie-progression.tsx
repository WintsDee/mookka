
import React from "react";
import { StatusSelector } from "./serie/status-selector";
import { SeasonAccordion } from "./serie/season-accordion";
import { ProgressHeader } from "./serie/progress-header";
import { useSerieProgression } from "./serie/use-serie-progression";
import { UpcomingEpisodes } from "./serie/upcoming-episodes";

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
    toggleEpisode,
    toggleSeason,
    updateStatus
  } = useSerieProgression(mediaDetails, progression);

  return (
    <div className="space-y-6">
      <ProgressHeader 
        watchedEpisodes={watchedEpisodes} 
        totalEpisodes={totalEpisodes} 
        status={status}
      />
      
      <StatusSelector
        currentStatus={status}
        onStatusChange={updateStatus}
      />

      <SeasonAccordion
        seasons={seasons}
        progression={progression}
        onToggleEpisode={toggleEpisode}
        onToggleSeason={toggleSeason}
      />

      {upcomingEpisodes.length > 0 && (
        <UpcomingEpisodes episodes={upcomingEpisodes} />
      )}
    </div>
  );
}
