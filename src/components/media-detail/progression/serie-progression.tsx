
import React from "react";
import { useSerieProgression } from "./serie/use-serie-progression";
import { StatusSelector } from "./serie/status-selector";
import { ProgressHeader } from "./serie/progress-header";
import { SeasonAccordion } from "./serie/season-accordion";
import { UpcomingEpisodes } from "./serie/upcoming-episodes";
import { useSubscription } from "./serie/subscription-service";

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

  const { isSubscribed, toggleSubscription } = useSubscription({
    mediaId: mediaDetails?.id || '',
    mediaType: 'serie'
  });

  const handleToggleEpisode = (seasonNumber: number, episodeNumber: number) => {
    console.log(`Toggling episode ${episodeNumber} of season ${seasonNumber}`);
    const updatedProgression = toggleEpisode(seasonNumber, episodeNumber);
    if (updatedProgression) {
      onUpdate(updatedProgression);
    }
  };

  const handleToggleSeason = (seasonNumber: number, episodeCount: number) => {
    console.log(`Toggling entire season ${seasonNumber} with ${episodeCount} episodes`);
    const updatedProgression = toggleSeason(seasonNumber, episodeCount);
    if (updatedProgression) {
      onUpdate(updatedProgression);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    console.log(`Changing status to: ${newStatus}`);
    const updatedProgression = updateStatus(newStatus);
    if (updatedProgression) {
      onUpdate(updatedProgression);
    }
  };

  console.log("Rendering SerieProgression with data:", {
    seasons,
    totalEpisodes,
    watchedEpisodes,
    status,
    progression,
    upcomingEpisodes
  });

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
      
      {upcomingEpisodes && upcomingEpisodes.length > 0 && (
        <UpcomingEpisodes 
          episodes={upcomingEpisodes} 
          isSubscribed={isSubscribed}
          onToggleSubscription={toggleSubscription}
        />
      )}
    </div>
  );
}
