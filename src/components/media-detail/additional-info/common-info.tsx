
import React from "react";
import { InfoItem } from "./info-item";
import { Calendar, Clock, Languages, Award } from "lucide-react";

export function CommonInfo({
  releaseDate,
  duration,
  language,
  metacritic,
  renderWebsite,
  website,
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
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
      {language && (
        <InfoItem 
          icon={<Languages className="h-4 w-4 text-muted-foreground" />}
          label="Langue" 
          value={language} 
        />
      )}
      {metacritic && (
        <InfoItem
          icon={<Award className="h-4 w-4 text-muted-foreground" />}
          label="Metacritic"
          value={`${metacritic}/10`}
          valueClassName={
            metacritic >= 8 ? "text-green-500" :
            metacritic >= 6 ? "text-yellow-500" :
            "text-red-500"
          }
        />
      )}
      {website && renderWebsite && renderWebsite()}
    </div>
  );
}
