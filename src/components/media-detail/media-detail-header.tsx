import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  
  const handleGoBack = () => {
    // Check if there's state from react-router indicating where we came from
    if (location.state?.from) {
      const previousPath = location.state.from;
      const searchParams = location.state.search || "";
      
      if (previousPath === "/recherche" && searchParams) {
        navigate({
          pathname: previousPath,
          search: searchParams
        }, { replace: true });
      } else {
        navigate(previousPath, { replace: true });
      }
    } else {
      // Default fallback
      navigate(-1);
    }
  };

  // Function to navigate to critique tab when clicking the user rating badge
  const handleUserRatingClick = () => {
    const tabsElement = document.querySelector('[value="critique"]');
    if (tabsElement instanceof HTMLElement) {
      tabsElement.click();
    }
  };

  return (
    <div className="relative h-52 w-full pt-8">
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "absolute top-2 left-4 z-20 p-2",
          floatingElement('button', 'high')
        )}
        onClick={handleGoBack}
      >
        <X className="text-white w-6 h-6" />
      </Button>
      
      <div className="absolute top-2 right-4 z-20 flex gap-2 flex-col items-end">
        {formattedMedia.rating && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-white font-medium drop-shadow-md">Note globale</span>
            <MediaRatingBadge 
              rating={formattedMedia.rating} 
              size="large"
            />
          </div>
        )}
        
        {formattedMedia.userRating && formattedMedia.userRating > 0 && (
          <div className="flex flex-col items-center gap-1" onClick={handleUserRatingClick}>
            <span className="text-xs text-white font-medium drop-shadow-md">Ma note</span>
            <MediaRatingBadge 
              rating={formattedMedia.userRating}
              size="large"
              className="bg-purple-500 hover:bg-purple-600 cursor-pointer transition-colors"
            />
          </div>
        )}
      </div>
      
      <div className="absolute inset-0">
        <img 
          src={formattedMedia.coverImage} 
          alt={formattedMedia.title} 
          className="w-full h-full object-cover"
        />
        <div className={cn(overlayGradient('to-top', 'strong'), "bg-black/75")} />
      </div>
      
      <div className="absolute bottom-0 left-0 p-6 w-full flex items-end">
        <img 
          src={formattedMedia.coverImage} 
          alt={formattedMedia.title} 
          className="w-24 h-36 object-cover rounded-lg border border-border shadow-lg mt-4"
        />
        <div className="flex-1 ml-4 mt-2">
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
                    "text-xs py-0 bg-black/60 backdrop-blur-sm border-white/30 text-white font-medium shadow-md",
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
