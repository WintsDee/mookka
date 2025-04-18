import React from "react";
import { Users, Building, Gamepad, Bookmark, LineChart, Tag, Link, Award, ServerCrash } from "lucide-react";
import { InfoItem } from "./info-item";
import { BadgesSection } from "./badges-section";
import { Badge } from "@/components/ui/badge";

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
  completionTimeMain?: number;
  completionTimeFull?: number;
  dlcs?: {
    name: string;
    description?: string;
    release_date?: string;
    cover_image?: string;
  }[];
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
  awards,
  completionTimeMain,
  completionTimeFull,
  dlcs
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
      
      {(completionTimeMain || completionTimeFull) && (
        <div className="mt-2">
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Temps de jeu</h3>
          {completionTimeMain && (
            <InfoItem 
              icon={<Gamepad className="h-4 w-4 text-muted-foreground" />}
              label="Histoire principale" 
              value={`${completionTimeMain} heures`} 
            />
          )}
          {completionTimeFull && (
            <InfoItem 
              icon={<ServerCrash className="h-4 w-4 text-muted-foreground" />}
              label="Complétion à 100%" 
              value={`${completionTimeFull} heures`} 
            />
          )}
        </div>
      )}
      
      {dlcs && dlcs.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">DLC et Extensions</h3>
          {dlcs.map((dlc, index) => (
            <div key={index} className="mb-2 p-2 bg-secondary/30 rounded-md">
              <div className="flex items-center justify-between">
                <span className="font-medium">{dlc.name}</span>
                {dlc.release_date && (
                  <Badge variant="outline" className="text-xs">
                    {new Date(dlc.release_date).toLocaleDateString('fr-FR')}
                  </Badge>
                )}
              </div>
              {dlc.description && (
                <p className="text-xs text-muted-foreground mt-1">{dlc.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
