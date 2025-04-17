
import React, { useEffect } from "react";
import { useSerieProgression } from "./serie/use-serie-progression";
import { StatusSelector } from "./serie/status-selector";
import { ProgressHeader } from "./serie/progress-header";
import { SeasonAccordion } from "./serie/season-accordion";
import { UpcomingEpisodes } from "./serie/upcoming-episodes";
import { useSubscription } from "./serie/subscription-service";
import { useToast } from "@/components/ui/use-toast";

interface SerieProgressionProps {
  mediaDetails: any;
  progression: any;
  onUpdate: (progression: any) => void;
}

export function SerieProgression({ mediaDetails, progression, onUpdate }: SerieProgressionProps) {
  const { toast } = useToast();
  
  const {
    seasons,
    upcomingEpisodes,
    totalEpisodes,
    watchedEpisodes,
    status,
    progression: currentProgression,
    toggleEpisode,
    toggleSeason,
    updateStatus
  } = useSerieProgression(mediaDetails, progression);

  // Debugging
  useEffect(() => {
    console.log("Serie progression updated:", { currentProgression });
  }, [currentProgression]);

  const { isSubscribed, toggleSubscription } = useSubscription({
    mediaId: mediaDetails?.id || '',
    mediaType: 'serie'
  });

  const handleToggleEpisode = (seasonNumber: number, episodeNumber: number) => {
    console.log(`Toggling episode ${episodeNumber} of season ${seasonNumber}`);
    
    const updatedProgression = toggleEpisode(seasonNumber, episodeNumber);
    if (updatedProgression) {
      console.log("Updated progression after toggle:", updatedProgression);
      onUpdate(updatedProgression);
      
      // Provide feedback to user
      toast({
        description: "Progression mise à jour",
        duration: 1500,
      });
    }
  };

  const handleToggleSeason = (seasonNumber: number, episodeCount: number) => {
    console.log(`Toggling entire season ${seasonNumber} with ${episodeCount} episodes`);
    
    const updatedProgression = toggleSeason(seasonNumber, episodeCount);
    if (updatedProgression) {
      console.log("Updated progression after season toggle:", updatedProgression);
      onUpdate(updatedProgression);
      
      // Provide feedback to user
      toast({
        description: "Progression de la saison mise à jour",
        duration: 1500,
      });
    }
  };

  const handleStatusChange = (newStatus: string) => {
    console.log(`Changing status to: ${newStatus}`);
    
    const updatedProgression = updateStatus(newStatus);
    if (updatedProgression) {
      console.log("Updated progression after status change:", updatedProgression);
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
        progression={currentProgression} 
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
