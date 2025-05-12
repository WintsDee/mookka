
import React, { useState } from "react";
import { ProgressHeader } from "./serie/progress-header";
import { StatusSelector } from "./serie/status-selector";
import { SeasonAccordion } from "./serie/season-accordion";
import { useSerieProgression } from "./serie/use-serie-progression";
import { NotesTextarea } from "./notes-textarea";
import { EpisodeList } from "./serie/episode-list";
import { UpcomingEpisodes } from "./serie/upcoming-episodes";
import { useToast } from "@/hooks/use-toast";

interface SerieProgressionProps {
  mediaDetails: any;
  progression: any;
  onUpdate: (progression: any) => void;
}

export function SerieProgression({ mediaDetails, progression, onUpdate }: SerieProgressionProps) {
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const { toast } = useToast();
  
  const {
    seasons,
    totalEpisodes,
    watchedEpisodes,
    status,
    upcomingEpisodes,
    progression: updatedProgression,
    toggleEpisode,
    toggleSeason,
    updateStatus
  } = useSerieProgression(mediaDetails, progression);

  const handleSeasonToggle = (seasonNumber: number, episodeCount: number) => {
    try {
      const updated = toggleSeason(seasonNumber, episodeCount);
      onUpdate(updated);
      
      toast({
        title: "Progression mise à jour",
        description: "La progression de la saison a été enregistrée",
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la saison:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la progression",
        variant: "destructive",
      });
    }
  };

  const handleEpisodeToggle = (seasonNumber: number, episodeNumber: number) => {
    try {
      const updated = toggleEpisode(seasonNumber, episodeNumber);
      onUpdate(updated);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'épisode:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la progression",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (newStatus: string) => {
    try {
      const updated = updateStatus(newStatus);
      onUpdate(updated);
      
      toast({
        title: "Statut mis à jour",
        description: `La série est maintenant marquée comme "${newStatus === 'to-watch' ? 'À voir' : newStatus === 'watching' ? 'En cours' : 'Terminée'}"`,
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
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

  if (!seasons || seasons.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Aucune information sur les saisons disponible</p>
      </div>
    );
  }

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
              <div className="px-4 pb-4">
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
      
      {upcomingEpisodes && upcomingEpisodes.length > 0 && (
        <UpcomingEpisodes episodes={upcomingEpisodes} />
      )}
        
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
