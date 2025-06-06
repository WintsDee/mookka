
import React from "react";
import { Link } from "react-router-dom";
import { Media } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Gamepad, Film, Tv, Check, Eye, Ban, Play, PauseCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MediaRatingBadge } from "@/components/media-detail/media-rating-badge";
import { MediaRatingStars } from "@/components/media-rating-stars";

interface MediaCardProps {
  media: Media;
  size?: "small" | "medium" | "large";
  showDetails?: boolean;
  from?: string;
  showStatusBadge?: boolean;
  userRating?: number;
}

const MediaCard = ({ 
  media, 
  size = "medium", 
  showDetails = true, 
  from, 
  showStatusBadge = true,
  userRating
}: MediaCardProps) => {
  // Normalize rating to 10-point scale if it's not already
  const normalizedRating = media.rating 
    ? media.rating > 5 
      ? media.rating 
      : parseFloat(((media.rating / 5) * 10).toFixed(1))
    : undefined;

  const { id, title, type, coverImage, year, status, duration } = media;
  const isMobile = useIsMobile();
  
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
    if (!status || !showStatusBadge) return null;
    
    let statusClass = "";
    let statusText = "";
    let StatusIcon = null;
    
    switch (status) {
      // Statuts "à faire"
      case "to-watch":
      case "to-read":
      case "to-play":
        statusClass = "bg-amber-600 border-amber-600 text-white";
        statusText = "À voir";
        StatusIcon = Eye;
        break;
      
      // Statuts "en cours"
      case "watching":
      case "reading":
      case "playing":
        statusClass = "bg-blue-600 border-blue-600 text-white";
        statusText = "En cours";
        StatusIcon = Play;
        break;
      
      // Statut "terminé"
      case "completed":
        statusClass = "bg-emerald-600 border-emerald-600 text-white";
        statusText = "Terminé";
        StatusIcon = Check;
        break;

      // Nouveau statut "abandonné"
      case "abandoned":
        statusClass = "bg-red-600 border-red-600 text-white";
        statusText = "Abandonné";
        StatusIcon = Ban;
        break;
    }
    
    return (
      <Badge className={`absolute top-2 left-2 text-xs px-2 py-1 border ${statusClass} flex items-center gap-1 shadow-md backdrop-blur-sm z-10 font-medium`}>
        {StatusIcon && <StatusIcon className="h-3 w-3" />}
        {statusText}
      </Badge>
    );
  };
  
  const getTypeVariant = () => {
    return type as "film" | "serie" | "book" | "game";
  };

  return (
    <Link 
      to={`/media/${type}/${id}`} 
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
          {!userRating && (
            isMobile ? (
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
                className="absolute top-2 right-2 text-xs py-1 px-2 shadow-md font-semibold border border-white/20"
              >
                <MediaTypeIcon />
                {type === "film" ? "Film" : 
                 type === "serie" ? "Série" : 
                 type === "book" ? "Livre" : "Jeu"}
              </Badge>
            )
          )}
          
          {/* Information - Always visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent rounded-lg">
            <div className="absolute bottom-0 left-0 p-3 w-full">
              <h3 className="text-white font-bold text-sm line-clamp-2 mb-2">{title}</h3>
              {showDetails && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <MediaTypeIcon />
                      <span className="text-xs text-white/80">{year}</span>
                    </div>
                    
                    {/* Ratings section - User rating above general rating */}
                    <div className="flex flex-col items-end gap-1">
                      {userRating && (
                        <div className="bg-blue-600/90 backdrop-blur-sm rounded-full px-2 py-0.5">
                          <MediaRatingStars 
                            rating={userRating} 
                            size="small"
                            showNumber={false}
                            className="text-white"
                          />
                        </div>
                      )}
                      {normalizedRating && (
                        <MediaRatingBadge 
                          rating={normalizedRating} 
                          size="small" 
                        />
                      )}
                    </div>
                  </div>
                  
                  {duration && (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-white/60 mr-1" />
                      <span className="text-xs text-white/60">{duration}</span>
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
