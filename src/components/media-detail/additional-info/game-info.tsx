
import React from "react";
import { Users, Building, Gamepad, Bookmark, LineChart, Tag, Link, Award } from "lucide-react";
import { InfoItem } from "./info-item";
import { BadgesSection } from "./badges-section";

interface GameInfoProps {
  developer?: string;
  publisher?: string;
  platform?: string;
  esrbRating?: string;
  metacritic?: number;
  genres?: string;
  website?: string;
  tags?: string[];
  awards?: string[];
}

export function GameInfo({
  developer,
  publisher,
  platform,
  esrbRating,
  metacritic,
  genres,
  website,
  tags,
  awards
}: GameInfoProps) {
  // Calculate if the component will render anything
  const hasInfo = developer || publisher || platform || esrbRating || metacritic || genres || website;
  
  if (!hasInfo && !tags?.length && !awards?.length) return null;
  
  return (
    <>
      {developer && (
        <InfoItem 
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          label="Développeur" 
          value={developer} 
        />
      )}
      
      {publisher && (
        <InfoItem 
          icon={<Building className="h-4 w-4 text-muted-foreground" />}
          label="Éditeur" 
          value={publisher} 
        />
      )}
      
      {platform && (
        <InfoItem 
          icon={<Gamepad className="h-4 w-4 text-muted-foreground" />}
          label="Plateformes" 
          value={platform} 
        />
      )}
      
      {esrbRating && (
        <InfoItem 
          icon={<Bookmark className="h-4 w-4 text-muted-foreground" />}
          label="Classification" 
          value={esrbRating} 
        />
      )}
      
      {metacritic !== undefined && (
        <InfoItem 
          icon={<LineChart className="h-4 w-4 text-muted-foreground" />}
          label="Metacritic" 
          value={metacritic.toString()} 
        />
      )}
      
      {genres && (
        <InfoItem 
          icon={<Tag className="h-4 w-4 text-muted-foreground" />}
          label="Genres" 
          value={genres} 
        />
      )}
      
      {website && (
        <InfoItem 
          icon={<Link className="h-4 w-4 text-muted-foreground" />}
          label="Site web" 
          value={website}
          showSeparator={!!tags?.length || !!awards?.length}
        />
      )}
      
      <BadgesSection 
        title="Tags" 
        items={tags} 
        icon={<Tag className="h-4 w-4 text-muted-foreground" />} 
      />
      
      <BadgesSection 
        title="Récompenses" 
        items={awards} 
        icon={<Award className="h-4 w-4 text-muted-foreground" />} 
        variant="outline" 
        maxItems={5}
      />
    </>
  );
}
