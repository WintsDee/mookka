
import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Eye, Timer, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface GameProgressionProps {
  mediaDetails: any;
  progression: any;
  onUpdate: (progression: any) => void;
}

export function GameProgression({ mediaDetails, progression, onUpdate }: GameProgressionProps) {
  const [completionPercentage, setCompletionPercentage] = useState(progression?.completion_percentage || 0);
  const [playtime, setPlaytime] = useState(progression?.playtime || 0);
  const [status, setStatus] = useState(progression?.status || 'to-play');

  useEffect(() => {
    // Mettre à jour quand la progression externe change
    if (progression) {
      setCompletionPercentage(progression.completion_percentage || 0);
      setPlaytime(progression.playtime || 0);
      setStatus(progression.status || 'to-play');
    }
  }, [progression]);

  const updateCompletionPercentage = (value: number[]) => {
    const newPercentage = value[0];
    setCompletionPercentage(newPercentage);
    
    let newStatus = status;
    if (newPercentage === 0) {
      newStatus = 'to-play';
    } else if (newPercentage === 100) {
      newStatus = 'completed';
    } else {
      newStatus = 'playing';
    }
    
    setStatus(newStatus);
    
    onUpdate({
      ...progression,
      completion_percentage: newPercentage,
      playtime,
      status: newStatus
    });
  };

  const updatePlaytime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlaytime = parseInt(e.target.value) || 0;
    setPlaytime(newPlaytime);
    
    let newStatus = status;
    if (newPlaytime === 0 && completionPercentage === 0) {
      newStatus = 'to-play';
    } else if (completionPercentage === 100) {
      newStatus = 'completed';
    } else if (newPlaytime > 0 || completionPercentage > 0) {
      newStatus = 'playing';
    }
    
    setStatus(newStatus);
    
    onUpdate({
      ...progression,
      completion_percentage: completionPercentage,
      playtime: newPlaytime,
      status: newStatus
    });
  };

  const updateStatus = (newStatus: string) => {
    setStatus(newStatus);
    
    let newCompletionPercentage = completionPercentage;
    
    if (newStatus === 'completed') {
      newCompletionPercentage = 100;
    } else if (newStatus === 'to-play') {
      newCompletionPercentage = 0;
    } else if (newStatus === 'playing' && completionPercentage === 0) {
      newCompletionPercentage = 1;
    }
    
    setCompletionPercentage(newCompletionPercentage);
    
    onUpdate({
      ...progression,
      completion_percentage: newCompletionPercentage,
      playtime,
      status: newStatus
    });
  };

  // Formater le statut pour l'affichage
  const getStatusLabel = (statusCode: string) => {
    switch (statusCode) {
      case 'to-play': return 'À jouer';
      case 'playing': return 'En cours';
      case 'completed': return 'Terminé';
      default: return 'À jouer';
    }
  };

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'to-play': return 'text-yellow-500';
      case 'playing': return 'text-purple-500';
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
            variant={status === 'to-play' ? 'default' : 'outline'}
            className={status === 'to-play' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            onClick={() => updateStatus('to-play')}
          >
            <Eye className="h-4 w-4 mr-1" />
            À jouer
          </Button>
          <Button
            size="sm"
            variant={status === 'playing' ? 'default' : 'outline'}
            className={status === 'playing' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            onClick={() => updateStatus('playing')}
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
      </div>

      <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4 space-y-4">
        <div className="flex items-center mb-2">
          <Trophy className="h-5 w-5 mr-2 text-primary" />
          <span className="font-medium">Avancement du jeu</span>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pourcentage de complétion</span>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            
            <Slider
              value={[completionPercentage]}
              max={100}
              step={1}
              onValueChange={updateCompletionPercentage}
              className="py-2"
            />
            
            <Progress 
              value={completionPercentage} 
              className="h-2 bg-secondary/30"
            />
          </div>
          
          <div>
            <label htmlFor="playtime" className="block text-sm text-muted-foreground mb-1">
              Temps de jeu (heures)
            </label>
            <div className="flex items-center">
              <Input
                id="playtime"
                type="number"
                min={0}
                value={playtime}
                onChange={updatePlaytime}
                className="w-full"
              />
              <Timer className="h-4 w-4 ml-2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
