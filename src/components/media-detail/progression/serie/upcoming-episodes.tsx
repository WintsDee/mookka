
import React from "react";
import { CalendarCheck, Bell, BellOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from "@/components/ui/use-toast";

interface UpcomingEpisode {
  season_number: number;
  episode_number: number;
  name?: string;
  air_date?: string;
}

interface UpcomingEpisodesProps {
  episodes: UpcomingEpisode[];
  isSubscribed?: boolean;
  onToggleSubscription?: () => void;
}

export function UpcomingEpisodes({ 
  episodes, 
  isSubscribed = false,
  onToggleSubscription 
}: UpcomingEpisodesProps) {
  const { toast } = useToast();
  
  if (!episodes || episodes.length === 0) {
    return null;
  }

  const handleToggleSubscription = () => {
    if (onToggleSubscription) {
      onToggleSubscription();
    } else {
      // Fallback if no handler is provided
      toast({
        title: isSubscribed ? "Notifications désactivées" : "Notifications activées",
        description: isSubscribed 
          ? "Vous ne serez plus notifié des nouveaux épisodes." 
          : "Vous serez notifié lors de la sortie de nouveaux épisodes.",
        duration: 3000
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date non confirmée';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date non confirmée';
      
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return 'Date non confirmée';
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center">
          <CalendarCheck className="h-5 w-5 mr-2 text-primary" />
          À venir
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          className={`${isSubscribed ? 'bg-primary/10 text-primary' : ''} flex items-center`}
          onClick={handleToggleSubscription}
        >
          {isSubscribed ? (
            <>
              <BellOff className="h-4 w-4 mr-2" />
              Ne plus suivre
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Être notifié
            </>
          )}
        </Button>
      </div>
      
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
