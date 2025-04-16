
import React from "react";
import { useSerieProgression } from "./serie/use-serie-progression";
import { StatusSelector } from "./serie/status-selector";
import { ProgressHeader } from "./serie/progress-header";
import { SeasonAccordion } from "./serie/season-accordion";
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

  const handleToggleEpisode = (seasonNumber: number, episodeNumber: number) => {
    const updatedProgression = toggleEpisode(seasonNumber, episodeNumber);
    onUpdate(updatedProgression);
  };

  const handleToggleSeason = (seasonNumber: number, episodeCount: number) => {
    const updatedProgression = toggleSeason(seasonNumber, episodeCount);
    onUpdate(updatedProgression);
  };

  const handleStatusChange = (newStatus: string) => {
    const updatedProgression = updateStatus(newStatus);
    onUpdate(updatedProgression);
  };

  return (
    <div className="space-y-6">
      <ProgressHeader 
        watchedEpisodes={watchedEpisodes} 
        totalEpisodes={totalEpisodes} 
        status={status}
      />
      
      <StatusSelector 
        currentStatus={status} 
        onStatusChange={handleStatusChange} 
      />
      
      <SeasonAccordion 
        seasons={seasons} 
        progression={progression} 
        onToggleEpisode={handleToggleEpisode} 
        onToggleSeason={handleToggleSeason} 
      />
      
      <UpcomingEpisodes episodes={upcomingEpisodes} />
    </div>
  );
}
