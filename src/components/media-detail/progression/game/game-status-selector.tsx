
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GameStatusSelectorProps {
  status: string;
  onStatusChange: (status: 'to-play' | 'playing' | 'completed') => void;
}

export function GameStatusSelector({ status, onStatusChange }: GameStatusSelectorProps) {
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
          onClick={() => onStatusChange('to-play')}
        >
          <Eye className="h-4 w-4 mr-1" />
          À jouer
        </Button>
        <Button
          size="sm"
          variant={status === 'playing' ? 'default' : 'outline'}
          className={status === 'playing' ? 'bg-purple-500 hover:bg-purple-600' : ''}
          onClick={() => onStatusChange('playing')}
        >
          <Clock className="h-4 w-4 mr-1" />
          En cours
        </Button>
        <Button
          size="sm"
          variant={status === 'completed' ? 'default' : 'outline'}
          className={status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}
          onClick={() => onStatusChange('completed')}
        >
          <Check className="h-4 w-4 mr-1" />
          Terminé
        </Button>
      </div>
    </div>
  );
}
