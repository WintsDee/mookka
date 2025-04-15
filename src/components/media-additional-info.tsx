
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, Calendar, User, Users, Building, Gamepad, Tv, Film, BookOpen, 
  Globe, DollarSign, Award, Languages, Hash, Link, Tag, Trophy, 
  BookText, Bookmark, Layers, LineChart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdditionalInfo {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface MediaAdditionalInfoProps {
  mediaType: string;
  releaseDate?: string;
  duration?: string;
  director?: string;
  cast?: string[];
  studio?: string;
  publisher?: string;
  developer?: string;
  author?: string;
  pages?: number;
  seasons?: number;
  episodes?: number;
  platform?: string;
  awards?: string[];
  originalTitle?: string;
  language?: string;
  budget?: string;
  revenue?: string;
  productionCountries?: string;
  creators?: string;
  status?: string;
  networks?: string;
  nextEpisode?: string;
  isbn?: string;
  isbn10?: string;
  printType?: string;
  maturityRating?: string;
  publishDate?: string;
  esrbRating?: string;
  metacritic?: number;
  genres?: string;
  website?: string;
  tags?: string[];
}

export function MediaAdditionalInfo({
  mediaType,
  releaseDate,
  duration,
  director,
  cast,
  studio,
  publisher,
  developer,
  author,
  pages,
  seasons,
  episodes,
  platform,
  awards,
  originalTitle,
  language,
  budget,
  revenue,
  productionCountries,
  creators,
  status,
  networks,
  nextEpisode,
  isbn,
  isbn10,
  printType,
  maturityRating,
  publishDate,
  esrbRating,
  metacritic,
  genres,
  website,
  tags
}: MediaAdditionalInfoProps) {
  
  const getInfoList = (): AdditionalInfo[] => {
    const infoList: AdditionalInfo[] = [];
    
    if (releaseDate) {
      infoList.push({ 
        label: "Date de sortie", 
        value: releaseDate,
        icon: <Calendar className="h-4 w-4 text-muted-foreground" />
      });
    }
    
    if (duration) {
      infoList.push({ 
        label: "Durée", 
        value: duration,
        icon: <Clock className="h-4 w-4 text-muted-foreground" /> 
      });
    }
    
    switch (mediaType) {
      case 'film':
        if (director) {
          infoList.push({ 
            label: "Réalisateur", 
            value: director,
            icon: <User className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (studio) {
          infoList.push({ 
            label: "Studio", 
            value: studio,
            icon: <Building className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (originalTitle) {
          infoList.push({ 
            label: "Titre original", 
            value: originalTitle,
            icon: <BookText className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (language) {
          infoList.push({ 
            label: "Langue", 
            value: language,
            icon: <Languages className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (budget) {
          infoList.push({ 
            label: "Budget", 
            value: budget,
            icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (revenue) {
          infoList.push({ 
            label: "Recettes", 
            value: revenue,
            icon: <DollarSign className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (productionCountries) {
          infoList.push({ 
            label: "Pays de production", 
            value: productionCountries,
            icon: <Globe className="h-4 w-4 text-muted-foreground" />
          });
        }
        break;
        
      case 'serie':
        if (creators) {
          infoList.push({ 
            label: "Créateurs", 
            value: creators,
            icon: <User className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (seasons) {
          infoList.push({ 
            label: "Saisons", 
            value: seasons.toString(),
            icon: <Tv className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (episodes) {
          infoList.push({ 
            label: "Épisodes", 
            value: episodes.toString(),
            icon: <Film className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (status) {
          infoList.push({ 
            label: "Statut", 
            value: status,
            icon: <Bookmark className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (networks) {
          infoList.push({ 
            label: "Chaînes/Plateformes", 
            value: networks,
            icon: <Tv className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (originalTitle) {
          infoList.push({ 
            label: "Titre original", 
            value: originalTitle,
            icon: <BookText className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (language) {
          infoList.push({ 
            label: "Langue", 
            value: language,
            icon: <Languages className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (nextEpisode) {
          infoList.push({ 
            label: "Prochain épisode", 
            value: nextEpisode,
            icon: <Calendar className="h-4 w-4 text-muted-foreground" />
          });
        }
        break;
        
      case 'book':
        if (author) {
          infoList.push({ 
            label: "Auteur", 
            value: author,
            icon: <User className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (publisher) {
          infoList.push({ 
            label: "Éditeur", 
            value: publisher,
            icon: <Building className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (pages) {
          infoList.push({ 
            label: "Pages", 
            value: pages.toString(),
            icon: <BookOpen className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (isbn) {
          infoList.push({ 
            label: "ISBN-13", 
            value: isbn,
            icon: <Hash className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (isbn10) {
          infoList.push({ 
            label: "ISBN-10", 
            value: isbn10,
            icon: <Hash className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (language) {
          infoList.push({ 
            label: "Langue", 
            value: language,
            icon: <Languages className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (printType) {
          infoList.push({ 
            label: "Type d'impression", 
            value: printType,
            icon: <Layers className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (maturityRating) {
          infoList.push({ 
            label: "Classification", 
            value: maturityRating,
            icon: <Bookmark className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (publishDate) {
          infoList.push({ 
            label: "Date de publication", 
            value: publishDate,
            icon: <Calendar className="h-4 w-4 text-muted-foreground" />
          });
        }
        break;
        
      case 'game':
        if (developer) {
          infoList.push({ 
            label: "Développeur", 
            value: developer,
            icon: <Users className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (publisher) {
          infoList.push({ 
            label: "Éditeur", 
            value: publisher,
            icon: <Building className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (platform) {
          infoList.push({ 
            label: "Plateformes", 
            value: platform,
            icon: <Gamepad className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (esrbRating) {
          infoList.push({ 
            label: "Classification", 
            value: esrbRating,
            icon: <Bookmark className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (metacritic) {
          infoList.push({ 
            label: "Metacritic", 
            value: metacritic,
            icon: <LineChart className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (genres) {
          infoList.push({ 
            label: "Genres", 
            value: genres,
            icon: <Tag className="h-4 w-4 text-muted-foreground" />
          });
        }
        if (website) {
          infoList.push({ 
            label: "Site web", 
            value: website,
            icon: <Link className="h-4 w-4 text-muted-foreground" />
          });
        }
        break;
    }
    
    return infoList;
  };
  
  const infoList = getInfoList();
  
  return (
    <Card className="bg-secondary/40 border-border">
      <CardContent className="p-4 space-y-3">
        {infoList.map((info, index) => (
          <React.Fragment key={index}>
            <div className="flex items-start gap-2">
              {info.icon}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{info.label}</p>
                <p className="text-sm font-medium">{info.value}</p>
              </div>
            </div>
            {index < infoList.length - 1 && <Separator className="my-1" />}
          </React.Fragment>
        ))}
        
        {awards && awards.length > 0 && (
          <>
            <Separator className="my-1" />
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Récompenses</p>
              <div className="flex flex-wrap gap-2">
                {awards.map((award, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10">
                    {award}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
        
        {cast && cast.length > 0 && (
          <>
            <Separator className="my-1" />
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Distribution</p>
              <div className="flex flex-wrap gap-2">
                {cast.slice(0, 5).map((actor, index) => (
                  <Badge key={index} variant="outline" className="bg-secondary/60">
                    {actor}
                  </Badge>
                ))}
                {cast.length > 5 && (
                  <Badge variant="outline" className="bg-secondary/60">
                    +{cast.length - 5}
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
        
        {tags && tags.length > 0 && (
          <>
            <Separator className="my-1" />
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-secondary/60">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
