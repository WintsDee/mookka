
import React from "react";
import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UpcomingEpisodesProps {
  episodes: any[];
}

export function UpcomingEpisodes({ episodes }: UpcomingEpisodesProps) {
  if (!episodes || episodes.length === 0) {
    return null;
  }

  // Formater la date en français
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non confirmée';
    
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Date non confirmée';
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <CalendarCheck className="h-5 w-5 mr-2 text-primary" />
        Prochains épisodes
      </h3>
      <div className="space-y-3">
        {episodes.map((episode, index) => (
          <div key={index} className="bg-card/30 backdrop-blur-sm p-3 rounded-md border border-border/30">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                S{episode.season_number}E{episode.episode_number} - {episode.name || 'Épisode à venir'}
              </span>
              <Badge variant="outline" className="bg-background/50">
                {formatDate(episode.air_date)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
