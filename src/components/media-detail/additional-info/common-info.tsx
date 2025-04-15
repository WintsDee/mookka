
import React from "react";
import { Calendar, Clock } from "lucide-react";
import { InfoItem } from "./info-item";

interface CommonInfoProps {
  releaseDate?: string;
  duration?: string;
}

export function CommonInfo({ releaseDate, duration }: CommonInfoProps) {
  if (!releaseDate && !duration) return null;
  
  return (
    <>
      {releaseDate && (
        <InfoItem 
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          label="Date de sortie" 
          value={releaseDate} 
        />
      )}
      
      {duration && (
        <InfoItem 
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          label="Durée" 
          value={duration} 
        />
      )}
    </>
  );
}
