
import React from "react";
import { User, Building, BookText, Languages, DollarSign, Globe, Award, Users } from "lucide-react";
import { InfoItem } from "./info-item";
import { BadgesSection } from "./badges-section";

interface FilmInfoProps {
  director?: string;
  studio?: string;
  originalTitle?: string;
  language?: string;
  budget?: string;
  revenue?: string;
  productionCountries?: string;
  cast?: string[];
  awards?: string[];
}

export function FilmInfo({ 
  director, 
  studio, 
  originalTitle, 
  language, 
  budget, 
  revenue, 
  productionCountries,
  cast,
  awards
}: FilmInfoProps) {
  // Calculate if the component will render anything
  const hasInfo = director || studio || originalTitle || language || budget || revenue || productionCountries;
  
  if (!hasInfo && !cast?.length && !awards?.length) return null;
  
  return (
    <>
      {director && (
        <InfoItem 
          icon={<User className="h-4 w-4 text-muted-foreground" />}
          label="Réalisateur" 
          value={director} 
        />
      )}
      
      {studio && (
        <InfoItem 
          icon={<Building className="h-4 w-4 text-muted-foreground" />}
          label="Studio" 
          value={studio} 
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
      
      {budget && (
        <InfoItem 
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          label="Budget" 
          value={budget} 
        />
      )}
      
      {revenue && (
        <InfoItem 
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          label="Recettes" 
          value={revenue} 
          showSeparator={!!productionCountries || !!cast?.length || !!awards?.length}
        />
      )}
      
      {productionCountries && (
        <InfoItem 
          icon={<Globe className="h-4 w-4 text-muted-foreground" />}
          label="Pays de production" 
          value={productionCountries}
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
