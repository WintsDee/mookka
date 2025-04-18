
import React from "react";
import { CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";

interface UpcomingEpisodesProps {
  episodes: any[];
}

export function UpcomingEpisodes({ episodes }: UpcomingEpisodesProps) {
  if (!episodes || episodes.length === 0) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return isValid(date) 
        ? format(date, 'dd/MM/yyyy', { locale: fr })
        : 'Date non confirmée';
    } catch (error) {
      return 'Date non confirmée';
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <CalendarCheck className="h-5 w-5 mr-2 text-primary" />
        À venir
      </h3>
      <div className="space-y-3">
        {episodes.map((episode: any, index: number) => (
          <div key={index} className="bg-card/30 backdrop-blur-sm p-3 rounded-md border border-border/30">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                S{episode.season_number}E{episode.episode_number} - {episode.name || 'Épisode à venir'}
              </span>
              <Badge variant="outline" className="bg-background/50">
                {episode.air_date ? formatDate(episode.air_date) : 'Date non confirmée'}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
