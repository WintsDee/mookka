
import React, { useState, useEffect } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck, Check, Clock, Eye } from "lucide-react";

interface SerieProgressionProps {
  mediaDetails: any;
  progression: any;
  onUpdate: (progression: any) => void;
}

export function SerieProgression({ mediaDetails, progression, onUpdate }: SerieProgressionProps) {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [upcomingEpisodes, setUpcomingEpisodes] = useState<any[]>([]);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [watchedEpisodes, setWatchedEpisodes] = useState(0);
  const [status, setStatus] = useState(progression?.status || 'to-watch');

  useEffect(() => {
    // Initialiser les données des saisons à partir des détails du média
    if (mediaDetails?.seasons) {
      const formattedSeasons = Array.isArray(mediaDetails.seasons) 
        ? mediaDetails.seasons 
        : Array(mediaDetails.seasons).fill(null).map((_, i) => ({ 
            season_number: i + 1, 
            name: `Saison ${i + 1}`,
            episode_count: 10 // Valeur par défaut si non spécifiée
          }));
      
      setSeasons(formattedSeasons);
      
      // Calculer le nombre total d'épisodes
      const total = formattedSeasons.reduce((acc, season) => 
        acc + (season.episode_count || 0), 0);
      setTotalEpisodes(total);
      
      // Calculer les épisodes vus depuis la progression
      const watched = Object.values(progression?.watched_episodes || {}).flat().length;
      setWatchedEpisodes(watched);
      
      // Si nous avons des données sur les épisodes à venir
      if (mediaDetails.upcoming_episodes) {
        setUpcomingEpisodes(mediaDetails.upcoming_episodes);
      }
    }
  }, [mediaDetails, progression]);

  useEffect(() => {
    // Mettre à jour le status local quand la progression change
    if (progression?.status) {
      setStatus(progression.status);
    }
  }, [progression]);

  const toggleEpisode = (seasonNumber: number, episodeNumber: number) => {
    const newWatchedEpisodes = { ...progression.watched_episodes };
    
    if (!newWatchedEpisodes[seasonNumber]) {
      newWatchedEpisodes[seasonNumber] = [];
    }
    
    const episodeIndex = newWatchedEpisodes[seasonNumber].indexOf(episodeNumber);
    
    if (episodeIndex === -1) {
      // Ajouter l'épisode aux vus
      newWatchedEpisodes[seasonNumber].push(episodeNumber);
    } else {
      // Retirer l'épisode des vus
      newWatchedEpisodes[seasonNumber].splice(episodeIndex, 1);
    }
    
    // Calculer le nouveau nombre d'épisodes vus
    const newWatchedCount = Object.values(newWatchedEpisodes).flat().length;
    setWatchedEpisodes(newWatchedCount);
    
    // Mettre à jour automatiquement le statut en fonction de la progression
    let newStatus = status;
    if (newWatchedCount === 0) {
      newStatus = 'to-watch';
    } else if (newWatchedCount === totalEpisodes) {
      newStatus = 'completed';
    } else {
      newStatus = 'watching';
    }
    setStatus(newStatus);
    
    onUpdate({
      ...progression,
      watched_episodes: newWatchedEpisodes,
      watched_count: newWatchedCount,
      total_episodes: totalEpisodes,
      status: newStatus
    });
  };

  const toggleSeason = (seasonNumber: number, episodeCount: number) => {
    const newWatchedEpisodes = { ...progression.watched_episodes };
    
    // Vérifier si tous les épisodes de la saison sont déjà vus
    const seasonEpisodes = newWatchedEpisodes[seasonNumber] || [];
    const allWatched = seasonEpisodes.length === episodeCount;
    
    if (allWatched) {
      // Si tous sont vus, les retirer tous
      newWatchedEpisodes[seasonNumber] = [];
    } else {
      // Sinon, marquer tous les épisodes comme vus
      newWatchedEpisodes[seasonNumber] = Array.from({ length: episodeCount }, (_, i) => i + 1);
    }
    
    // Calculer le nouveau nombre d'épisodes vus
    const newWatchedCount = Object.values(newWatchedEpisodes).flat().length;
    setWatchedEpisodes(newWatchedCount);
    
    // Mettre à jour automatiquement le statut en fonction de la progression
    let newStatus = status;
    if (newWatchedCount === 0) {
      newStatus = 'to-watch';
    } else if (newWatchedCount === totalEpisodes) {
      newStatus = 'completed';
    } else {
      newStatus = 'watching';
    }
    setStatus(newStatus);
    
    onUpdate({
      ...progression,
      watched_episodes: newWatchedEpisodes,
      watched_count: newWatchedCount,
      total_episodes: totalEpisodes,
      status: newStatus
    });
  };

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
    onUpdate({
      ...progression,
      status: newStatus
    });
  };

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

  // Générer les épisodes de la saison
  const renderEpisodes = (seasonNumber: number, episodeCount: number) => {
    const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);
    const watchedEpisodesForSeason = progression?.watched_episodes?.[seasonNumber] || [];
    
    return episodes.map(episodeNumber => {
      const isWatched = watchedEpisodesForSeason.includes(episodeNumber);
      
      return (
        <div key={`s${seasonNumber}e${episodeNumber}`} className="flex items-center p-3 border-b last:border-b-0 border-border/30">
          <Checkbox 
            id={`s${seasonNumber}e${episodeNumber}`}
            checked={isWatched}
            onCheckedChange={() => toggleEpisode(seasonNumber, episodeNumber)}
            className="mr-3 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
          />
          <label 
            htmlFor={`s${seasonNumber}e${episodeNumber}`}
            className="flex-1 cursor-pointer font-medium"
          >
            Épisode {episodeNumber}
          </label>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Progression</h2>
          <Badge 
            className={`${getStatusColor(status)} bg-background/50 backdrop-blur-sm border-current px-3 py-1`}
          >
            {getStatusLabel(status)}
          </Badge>
        </div>
        
        <div className="flex gap-4 mb-4">
          <Button
            size="sm"
            variant={status === 'to-watch' ? 'default' : 'outline'}
            className={status === 'to-watch' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            onClick={() => updateStatus('to-watch')}
          >
            <Eye className="h-4 w-4 mr-1" />
            À voir
          </Button>
          <Button
            size="sm"
            variant={status === 'watching' ? 'default' : 'outline'}
            className={status === 'watching' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            onClick={() => updateStatus('watching')}
          >
            <Clock className="h-4 w-4 mr-1" />
            En cours
          </Button>
          <Button
            size="sm"
            variant={status === 'completed' ? 'default' : 'outline'}
            className={status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}
            onClick={() => updateStatus('completed')}
          >
            <Check className="h-4 w-4 mr-1" />
            Terminé
          </Button>
        </div>
        
        <Progress 
          value={totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0} 
          className="h-2 bg-secondary/30"
        />
        <p className="text-lg text-muted-foreground">
          {watchedEpisodes} épisodes vus sur {totalEpisodes} ({totalEpisodes > 0 ? Math.round((watchedEpisodes / totalEpisodes) * 100) : 0}%)
        </p>
      </div>

      {seasons.length > 0 && (
        <Accordion type="multiple" className="w-full space-y-4">
          {seasons.map((season, index) => {
            const seasonNumber = season.season_number || index + 1;
            const episodeCount = season.episode_count || 10;
            const watchedEpisodesForSeason = progression?.watched_episodes?.[seasonNumber] || [];
            const seasonProgress = episodeCount > 0 ? (watchedEpisodesForSeason.length / episodeCount) * 100 : 0;
            
            return (
              <AccordionItem 
                key={`season-${seasonNumber}`} 
                value={`season-${seasonNumber}`}
                className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xl font-semibold">Saison {seasonNumber}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {watchedEpisodesForSeason.length}/{episodeCount} épisodes
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSeason(seasonNumber, episodeCount);
                          }}
                        >
                          {watchedEpisodesForSeason.length === episodeCount ? 'Tout décocher' : 'Tout cocher'}
                        </Button>
                      </div>
                    </div>
                    <Progress 
                      value={seasonProgress} 
                      className="h-1.5 mt-2 bg-secondary/30"
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t border-border/30">
                  <div className="divide-y divide-border/20">
                    {renderEpisodes(seasonNumber, episodeCount)}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {upcomingEpisodes && upcomingEpisodes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <CalendarCheck className="h-5 w-5 mr-2 text-primary" />
            À venir
          </h3>
          <div className="space-y-3">
            {upcomingEpisodes.map((episode: any, index: number) => (
              <div key={index} className="bg-card/30 backdrop-blur-sm p-3 rounded-md border border-border/30">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    S{episode.season_number}E{episode.episode_number} - {episode.name || 'Épisode à venir'}
                  </span>
                  <Badge variant="outline" className="bg-background/50">
                    {episode.air_date ? new Date(episode.air_date).toLocaleDateString('fr-FR') : 'Date non confirmée'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
