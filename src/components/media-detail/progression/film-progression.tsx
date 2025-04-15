
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Clock, Eye, Timer } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface FilmProgressionProps {
  mediaDetails: any;
  progression: any;
  onUpdate: (progression: any) => void;
}

export function FilmProgression({ mediaDetails, progression, onUpdate }: FilmProgressionProps) {
  const [watched, setWatched] = useState(progression?.watched || false);
  const [watchTime, setWatchTime] = useState(progression?.watch_time || 0);
  const [status, setStatus] = useState(progression?.status || 'to-watch');
  const totalDuration = mediaDetails?.runtime ? parseInt(mediaDetails.runtime) : 0;

  useEffect(() => {
    // Mettre à jour quand la progression externe change
    if (progression) {
      setWatched(progression.watched || false);
      setWatchTime(progression.watch_time || 0);
      setStatus(progression.status || 'to-watch');
    }
  }, [progression]);

  const updateWatched = (isWatched: boolean) => {
    setWatched(isWatched);
    let newStatus = status;
    
    if (isWatched) {
      setWatchTime(totalDuration);
      newStatus = 'completed';
    } else {
      setWatchTime(0);
      newStatus = 'to-watch';
    }
    
    setStatus(newStatus);
    
    onUpdate({
      ...progression,
      watched: isWatched,
      watch_time: isWatched ? totalDuration : 0,
      status: newStatus
    });
  };

  const updateWatchTime = (time: number[]) => {
    const newTime = time[0];
    setWatchTime(newTime);
    
    let newStatus = 'to-watch';
    if (newTime === 0) {
      newStatus = 'to-watch';
      setWatched(false);
    } else if (newTime === totalDuration) {
      newStatus = 'completed';
      setWatched(true);
    } else {
      newStatus = 'watching';
      setWatched(false);
    }
    
    setStatus(newStatus);
    
    onUpdate({
      ...progression,
      watched: newTime === totalDuration,
      watch_time: newTime,
      status: newStatus
    });
  };

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
    
    let newWatched = watched;
    let newWatchTime = watchTime;
    
    if (newStatus === 'completed') {
      newWatched = true;
      newWatchTime = totalDuration;
    } else if (newStatus === 'to-watch') {
      newWatched = false;
      newWatchTime = 0;
    }
    
    setWatched(newWatched);
    setWatchTime(newWatchTime);
    
    onUpdate({
      ...progression,
      watched: newWatched,
      watch_time: newWatchTime,
      status: newStatus
    });
  };

  // Formater le statut pour l'affichage
  const getStatusLabel = (statusCode: string) => {
    switch (statusCode) {
      case 'to-watch': return 'À voir';
      case 'watching': return 'En cours';
      case 'completed': return 'Vu';
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
            Vu
          </Button>
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="film-watched"
              checked={watched}
              onCheckedChange={(checked) => updateWatched(checked as boolean)}
              className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <label 
              htmlFor="film-watched"
              className="font-medium cursor-pointer"
            >
              J'ai vu ce film
            </label>
          </div>
          
          {totalDuration > 0 && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Timer className="h-4 w-4 mr-1" />
              Durée: {totalDuration} minutes
            </div>
          )}
        </div>

        {totalDuration > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Progression dans le film</span>
              <span className="text-sm font-medium">
                {watchTime} / {totalDuration} minutes ({Math.round((watchTime / totalDuration) * 100)}%)
              </span>
            </div>
            
            <Slider
              value={[watchTime]}
              max={totalDuration}
              step={1}
              onValueChange={updateWatchTime}
              className="py-2"
            />
            
            <Progress 
              value={totalDuration > 0 ? (watchTime / totalDuration) * 100 : 0} 
              className="h-2 bg-secondary/30"
            />
          </div>
        )}
      </div>
    </div>
  );
}
