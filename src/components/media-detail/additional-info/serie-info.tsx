
import React from "react";
import { User, Tv, Film, Bookmark, BookText, Languages, Calendar, Award, Users } from "lucide-react";
import { InfoItem } from "./info-item";
import { BadgesSection } from "./badges-section";

interface SerieInfoProps {
  creators?: string;
  seasons?: number;
  episodes?: number;
  status?: string;
  networks?: string;
  originalTitle?: string;
  language?: string;
  nextEpisode?: string;
  cast?: string[];
  awards?: string[];
}

export function SerieInfo({ 
  creators, 
  seasons, 
  episodes, 
  status, 
  networks, 
  originalTitle, 
  language, 
  nextEpisode,
  cast,
  awards
}: SerieInfoProps) {
  // Calculate if the component will render anything
  const hasInfo = creators || seasons || episodes || status || networks || originalTitle || language || nextEpisode;
  
  if (!hasInfo && !cast?.length && !awards?.length) return null;
  
  return (
    <>
      {creators && (
        <InfoItem 
          icon={<User className="h-4 w-4 text-muted-foreground" />}
          label="Créateurs" 
          value={creators} 
        />
      )}
      
      {seasons !== undefined && (
        <InfoItem 
          icon={<Tv className="h-4 w-4 text-muted-foreground" />}
          label="Saisons" 
          value={seasons.toString()} 
        />
      )}
      
      {episodes !== undefined && (
        <InfoItem 
          icon={<Film className="h-4 w-4 text-muted-foreground" />}
          label="Épisodes" 
          value={episodes.toString()} 
        />
      )}
      
      {status && (
        <InfoItem 
          icon={<Bookmark className="h-4 w-4 text-muted-foreground" />}
          label="Statut" 
          value={status} 
        />
      )}
      
      {networks && (
        <InfoItem 
          icon={<Tv className="h-4 w-4 text-muted-foreground" />}
          label="Chaînes/Plateformes" 
          value={networks} 
        />
      )}
      
      {originalTitle && (
        <InfoItem 
          icon={<BookText className="h-4 w-4 text-muted-foreground" />}
          label="Titre original" 
          value={originalTitle} 
        />
      )}
      
      {language && (
        <InfoItem 
          icon={<Languages className="h-4 w-4 text-muted-foreground" />}
          label="Langue" 
          value={language} 
        />
      )}
      
      {nextEpisode && (
        <InfoItem 
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          label="Prochain épisode" 
          value={nextEpisode}
          showSeparator={!!cast?.length || !!awards?.length}
        />
      )}
      
      <BadgesSection 
        title="Distribution" 
        items={cast} 
        icon={<Users className="h-4 w-4 text-muted-foreground" />} 
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
