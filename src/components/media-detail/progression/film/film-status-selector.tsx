
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock, Eye, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MediaStatus } from "@/types";

interface FilmStatusSelectorProps {
  status: MediaStatus;
  onStatusChange: (status: MediaStatus) => void;
  isInLibrary?: boolean; // New prop to check if media is in library
}

export function FilmStatusSelector({ status, onStatusChange, isInLibrary = false }: FilmStatusSelectorProps) {
  const getStatusLabel = (statusCode: string) => {
    switch (statusCode) {
      case 'to-watch': return 'À voir';
      case 'watching': return 'En cours';
      case 'completed': return 'Vu';
      case 'abandoned': return 'Abandonné';
      default: return 'À voir';
    }
  };

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'to-watch': return 'text-yellow-500';
      case 'watching': return 'text-purple-500';
      case 'completed': return 'text-green-500';
      case 'abandoned': return 'text-gray-500';
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
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          size="sm"
          variant={status === 'to-watch' ? 'default' : 'outline'}
          className={status === 'to-watch' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
          onClick={() => onStatusChange('to-watch')}
        >
          <Eye className="h-4 w-4 mr-1" />
          À voir
        </Button>
        <Button
          size="sm"
          variant={status === 'watching' ? 'default' : 'outline'}
          className={status === 'watching' ? 'bg-purple-500 hover:bg-purple-600' : ''}
          onClick={() => onStatusChange('watching')}
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
          Vu
        </Button>
        
        {/* Only show the abandoned button if the media is already in the user's library */}
        {isInLibrary && (
          <Button
            size="sm"
            variant={status === 'abandoned' ? 'default' : 'outline'}
            className={status === 'abandoned' ? 'bg-gray-500 hover:bg-gray-600' : ''}
            onClick={() => onStatusChange('abandoned')}
          >
            <Ban className="h-4 w-4 mr-1" />
            Abandonné
          </Button>
        )}
      </div>
    </div>
  );
}
