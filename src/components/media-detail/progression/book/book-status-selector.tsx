
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Eye, Ban } from "lucide-react";

interface BookStatusSelectorProps {
  status: string;
  onStatusChange: (status: string) => void;
  isInLibrary?: boolean; // New prop to check if media is in library
}

export function BookStatusSelector({ status, onStatusChange, isInLibrary = false }: BookStatusSelectorProps) {
  // Formater le statut pour l'affichage
  const getStatusLabel = (statusCode: string) => {
    switch (statusCode) {
      case 'to-read': return 'À lire';
      case 'reading': return 'En cours';
      case 'completed': return 'Terminé';
      case 'abandoned': return 'Abandonné';
      default: return 'À lire';
    }
  };

  const getStatusColor = (statusCode: string) => {
    switch (statusCode) {
      case 'to-read': return 'text-yellow-500';
      case 'reading': return 'text-purple-500';
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
          variant={status === 'to-read' ? 'default' : 'outline'}
          className={status === 'to-read' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
          onClick={() => onStatusChange('to-read')}
          type="button"
        >
          <Eye className="h-4 w-4 mr-1" />
          À lire
        </Button>
        <Button
          size="sm"
          variant={status === 'reading' ? 'default' : 'outline'}
          className={status === 'reading' ? 'bg-purple-500 hover:bg-purple-600' : ''}
          onClick={() => onStatusChange('reading')}
          type="button"
        >
          <Clock className="h-4 w-4 mr-1" />
          En cours
        </Button>
        <Button
          size="sm"
          variant={status === 'completed' ? 'default' : 'outline'}
          className={status === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}
          onClick={() => onStatusChange('completed')}
          type="button"
        >
          <Check className="h-4 w-4 mr-1" />
          Terminé
        </Button>
        
        {/* Only show the abandoned button if the media is already in the user's library */}
        {isInLibrary && (
          <Button
            size="sm"
            variant={status === 'abandoned' ? 'default' : 'outline'}
            className={status === 'abandoned' ? 'bg-gray-500 hover:bg-gray-600' : ''}
            onClick={() => onStatusChange('abandoned')}
            type="button"
          >
            <Ban className="h-4 w-4 mr-1" />
            Abandonné
          </Button>
        )}
      </div>
    </div>
  );
}
