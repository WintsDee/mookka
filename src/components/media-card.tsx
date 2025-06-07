
import React from "react";
import { Link } from "react-router-dom";
import { Media } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, Gamepad, Film, Tv, Check, Eye, Ban, Play } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MediaRatingBadge } from "@/components/media-detail/media-rating-badge";

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
  
  const getStatusIcon = () => {
    if (!status || !showStatusBadge) return null;
    
    let StatusIcon = null;
    let iconClass = "";
    
    switch (status) {
      case "to-watch":
      case "to-read":
      case "to-play":
        StatusIcon = Eye;
        iconClass = "bg-amber-500 text-white";
        break;
      case "watching":
      case "reading":
      case "playing":
        StatusIcon = Play;
        iconClass = "bg-blue-500 text-white";
        break;
      case "completed":
        StatusIcon = Check;
        iconClass = "bg-emerald-500 text-white";
        break;
      case "abandoned":
        StatusIcon = Ban;
        iconClass = "bg-red-500 text-white";
        break;
      default:
        return null;
    }
    
    return (
      <div className={cn(
        "absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10",
        iconClass
      )}>
        <StatusIcon className="h-4 w-4" />
      </div>
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
          
          {/* Status Icon */}
          {getStatusIcon()}

          {/* Type Badge */}
          <Badge 
            variant={getTypeVariant()} 
            className="absolute top-2 right-2 text-xs py-1 px-2 shadow-md font-semibold border border-white/20"
          >
            <MediaTypeIcon />
            {type === "film" ? "Film" : 
             type === "serie" ? "Série" : 
             type === "book" ? "Livre" : "Jeu"}
          </Badge>
          
          {/* Information - Always visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent rounded-lg">
            <div className="absolute bottom-0 left-0 p-3 w-full">
              <h3 className="text-white font-bold text-sm line-clamp-2 mb-2">{title}</h3>
              {showDetails && (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center min-w-0 flex-1">
                      <MediaTypeIcon />
                      <span className="text-xs text-white/80 truncate">{year}</span>
                    </div>
                    
                    {/* Ratings section */}
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {userRating && (
                        <div className="bg-blue-600/90 backdrop-blur-sm rounded px-2 py-0.5">
                          <span className="text-white text-xs font-medium">
                            {userRating}/10
                          </span>
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
