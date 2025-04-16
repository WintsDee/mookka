
import React from "react";
import { ChevronLeft, Star, Calendar, Clock, StickyNote } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MediaRatingBadge } from "./media-rating-badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserNoteBadge } from "./user-note-badge";

interface MediaDetailHeaderProps {
  title: string;
  year: number;
  type: string;
  rating?: number;
  coverImage?: string;
  genres?: string[];
  duration?: string;
  userNote?: string;
  backTo?: string;
  backLabel?: string;
}

export function MediaDetailHeader({
  title,
  year,
  type,
  rating,
  coverImage,
  genres,
  duration,
  userNote,
  backTo = "/recherche",
  backLabel = "Retour",
}: MediaDetailHeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleBack = () => {
    navigate(backTo);
  };

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <div className="w-full h-full bg-secondary/50">
            {coverImage && (
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${coverImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/20"></div>
              </div>
            )}
          </div>
        </AspectRatio>
        
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 left-4 bg-background/50 backdrop-blur-sm h-8"
          onClick={handleBack}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {backLabel}
        </Button>
      </div>

      {/* Media Info */}
      <div className="px-4 -mt-16 sm:-mt-20 md:-mt-24 flex">
        {/* Cover Thumbnail */}
        <div className={cn(
          "relative rounded-lg overflow-hidden shadow-lg border-4 border-background",
          isMobile ? "w-24 h-36" : "w-32 h-48",
        )}>
          {coverImage ? (
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          <div className="absolute top-0 right-0">
            <div className={cn(
              "text-xs text-white font-medium px-1 py-0.5",
              type === "film" ? "bg-primary" :
              type === "serie" ? "bg-purple-600" :
              type === "book" ? "bg-amber-600" :
              "bg-green-600"
            )}>
              {type === "film" ? "Film" :
               type === "serie" ? "Série" :
               type === "book" ? "Livre" : "Jeu"}
            </div>
          </div>
        </div>

        {/* Title & Info */}
        <div className="flex-1 ml-4">
          <h1 className={cn(
            "font-bold text-foreground",
            isMobile ? "text-xl" : "text-2xl md:text-3xl",
          )}>
            {title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {year && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{year}</span>
              </Badge>
            )}
            
            {duration && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{duration}</span>
              </Badge>
            )}
            
            {rating && (
              <MediaRatingBadge rating={rating} />
            )}
            
            {userNote && <UserNoteBadge note={userNote} />}
          </div>
          
          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {genres.map(genre => (
                <Badge key={genre} variant="secondary" className="bg-secondary/40">
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
