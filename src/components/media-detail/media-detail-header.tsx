
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MediaType } from "@/types";
import { cn, overlayGradient, enhanceTextVisibility, floatingElement } from "@/lib/utils";
import { MediaRatingBadge } from "@/components/media-detail/media-rating-badge";

interface MediaDetailHeaderProps {
  media: any;
  formattedMedia: any;
  type: MediaType;
  onAddToCollection: () => void;
}

export function MediaDetailHeader({ media, formattedMedia, type, onAddToCollection }: MediaDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="relative h-44 w-full">
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "absolute top-4 left-4 z-10 p-2",
          floatingElement('button', 'medium')
        )}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="text-white w-6 h-6" />
      </Button>
      
      {/* Rating Display in Top Right */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {formattedMedia.rating && (
          <MediaRatingBadge 
            rating={formattedMedia.rating} 
            label="TMDB" 
            size="large"
          />
        )}
        {formattedMedia.userRating && formattedMedia.userRating > 0 && (
          <MediaRatingBadge 
            rating={formattedMedia.userRating} 
            label="Ma note" 
            size="large"
          />
        )}
      </div>
      
      <div className="absolute inset-0">
        <img 
          src={formattedMedia.coverImage} 
          alt={formattedMedia.title} 
          className="w-full h-full object-cover"
        />
        <div className={cn(overlayGradient('to-top', 'strong'), "bg-black/60")} />
      </div>
      
      <div className="absolute bottom-0 left-0 p-6 w-full flex items-end">
        <img 
          src={formattedMedia.coverImage} 
          alt={formattedMedia.title} 
          className="w-24 h-36 object-cover rounded-lg border border-border shadow-lg"
        />
        <div className="flex-1 ml-4">
          <div className="flex items-center gap-2">
            <h1 className={cn("text-2xl font-bold text-white drop-shadow-md", enhanceTextVisibility('strong'))}>
              {formattedMedia.title}
            </h1>
            <Badge variant={type} className="capitalize shadow-md">
              {type}
            </Badge>
          </div>
          <div className="flex items-center mt-1 text-white mb-2 font-medium drop-shadow-md">
            {formattedMedia.year && <span className="text-sm mr-3">{formattedMedia.year}</span>}
            {formattedMedia.duration && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-white mr-1" />
                <span className="text-sm">{formattedMedia.duration}</span>
              </div>
            )}
          </div>
          {formattedMedia.genres && formattedMedia.genres.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {formattedMedia.genres.map((genre: string) => (
                <Badge 
                  key={genre} 
                  variant="outline" 
                  className={cn(
                    "text-xs py-0 bg-black/40 backdrop-blur-sm border-white/20 text-white font-medium shadow-md",
                    floatingElement('badge', 'medium')
                  )}
                >
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
