
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ProgressHeaderProps {
  watchedEpisodes: number;
  totalEpisodes: number;
  status: string;
}

export function ProgressHeader({ 
  watchedEpisodes, 
  totalEpisodes, 
  status 
}: ProgressHeaderProps) {
  // Formater le statut pour l'affichage
  const getStatusLabel = (statusCode: string) => {
    switch (statusCode) {
      case 'to-watch': return 'À voir';
      case 'watching': return 'En cours';
      case 'completed': return 'Terminé';
      default: return 'À voir';
    }
  };

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'to-watch': return 'text-yellow-500';
      case 'watching': return 'text-purple-500';
      case 'completed': return 'text-green-500';
      default: return 'text-yellow-500';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold">Progression</h2>
        <Badge 
          className={`${getStatusColor(status)} bg-background/50 backdrop-blur-sm border-current px-3 py-1`}
        >
          {getStatusLabel(status)}
        </Badge>
      </div>
      
      <Progress 
        value={totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0} 
        className="h-2 bg-secondary/30"
      />
      <p className="text-lg text-muted-foreground">
        {watchedEpisodes} épisodes vus sur {totalEpisodes} ({totalEpisodes > 0 ? Math.round((watchedEpisodes / totalEpisodes) * 100) : 0}%)
      </p>
    </div>
  );
}
