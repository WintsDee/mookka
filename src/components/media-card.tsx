
import React from "react";
import { Link } from "react-router-dom";
import { Media } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Gamepad, Film, Tv } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MediaRatingBadge } from "@/components/media-detail/media-rating-badge";

interface MediaCardProps {
  media: Media;
  size?: "small" | "medium" | "large";
  showDetails?: boolean;
  from?: string;
}

const MediaCard = ({ media, size = "medium", showDetails = true, from }: MediaCardProps) => {
  // Normalize rating to 10-point scale if it's not already
  const normalizedRating = media.rating 
    ? media.rating > 5 
      ? media.rating 
      : parseFloat(((media.rating / 5) * 10).toFixed(1))
    : undefined;

  const { id, title, type, coverImage, year, genres, status, duration } = media;
  const isMobile = useIsMobile();
  
  // Déterminer l'ID à utiliser pour la navigation (important pour les livres)
  const navigationId = media.externalId && type === 'book' ? media.externalId : id;
  
  const sizeClasses = {
    small: "w-32 h-48",
    medium: "w-40 h-60",
    large: "w-48 h-72"
  };
  
  const MediaTypeIcon = () => {
    switch (type) {
      case "film":
        return <Film className="h-3 w-3 mr-1" />;
      case "serie":
        return <Tv className="h-3 w-3 mr-1" />;
      case "book":
        return <BookOpen className="h-3 w-3 mr-1" />;
      case "game":
        return <Gamepad className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };
  
  const getStatusBadge = () => {
    if (!status) return null;
    
    let statusClass = "";
    let statusText = "";
    
    switch (status) {
      // Statuts "à faire"
      case "to-watch":
      case "to-read":
      case "to-play":
        statusClass = "status-todo";
        statusText = type === "book" ? "À lire" : type === "game" ? "À jouer" : "À voir";
        break;
      
      // Statuts "en cours"
      case "watching":
      case "reading":
      case "playing":
        statusClass = "status-in-progress";
        statusText = "En cours";
        break;
      
      // Statut "terminé"
      case "completed":
        statusClass = "status-completed";
        statusText = type === "film" ? "Vu" : "Terminé";
        break;
    }
    
    return (
      <Badge className={`absolute top-2 left-2 text-[0.6rem] py-0 ${statusClass}`}>
        {statusText}
      </Badge>
    );
  };
  
  const getTypeVariant = () => {
    return type as "film" | "serie" | "book" | "game";
  };

  return (
    <Link 
      to={`/media/${type}/${navigationId}`} 
      state={from ? { from } : undefined}
      className="block animate-fade-in"
    >
      <div className={cn("media-card relative", sizeClasses[size])}>
        <div className="relative w-full h-full">
          {/* Cover image */}
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover rounded-lg"
          />
          
          {/* Status Badge */}
          {getStatusBadge()}
          
          {/* Type Badge - Repositioned for mobile */}
          {isMobile ? (
            <div className="absolute top-0 right-0">
              <div className={cn(
                "w-5 h-5 rounded-tr-lg flex items-center justify-center",
                `bg-media-${type}`
              )}>
                <MediaTypeIcon />
              </div>
            </div>
          ) : (
            <Badge 
              variant={getTypeVariant()} 
              className="absolute top-2 right-2 text-[0.6rem] py-0 shadow-md font-semibold border border-white/20"
            >
              <MediaTypeIcon />
              {type === "film" ? "Film" : 
               type === "serie" ? "Série" : 
               type === "book" ? "Livre" : "Jeu"}
            </Badge>
          )}
          
          {/* Information - Always visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-lg">
            <div className="absolute bottom-0 left-0 p-3 w-full">
              <h3 className="text-white font-bold text-sm line-clamp-2">{title}</h3>
              {showDetails && (
                <>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center">
                      <MediaTypeIcon />
                      <span className="text-xs text-white/80">{year}</span>
                    </div>
                    {normalizedRating && (
                      <MediaRatingBadge 
                        rating={normalizedRating} 
                        size="small" 
                      />
                    )}
                  </div>
                  {duration && (
                    <div className="flex items-center mt-1">
                      <Clock className="h-3 w-3 text-white/60 mr-1" />
                      <span className="text-xs text-white/60">{duration}</span>
                    </div>
                  )}
                  {genres && genres.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {genres.slice(0, 2).map((genre) => (
                        <Badge key={genre} variant="outline" className="text-[0.6rem] py-0 border-white/20 text-white/90">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className={cn(
          "absolute top-0 right-0 w-2 h-8", 
          `bg-media-${type}`,
          isMobile && "hidden"
        )} />
      </div>
    </Link>
  );
};

export { MediaCard };
