
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MediaType } from "@/types";
import { cn, overlayGradient, enhanceTextVisibility, floatingElement } from "@/lib/utils";

interface MediaDetailHeaderProps {
  media: any;
  formattedMedia: any;
  type: MediaType;
}

export function MediaDetailHeader({ media, formattedMedia, type }: MediaDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="relative h-72 w-full">
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
      
      <div className="absolute inset-0">
        <img 
          src={formattedMedia.coverImage} 
          alt={formattedMedia.title} 
          className="w-full h-full object-cover"
        />
        <div className={overlayGradient('to-top', 'medium')} />
      </div>
      
      <div className="absolute bottom-0 left-0 p-6 w-full">
        <div className="flex items-start gap-4">
          <img 
            src={formattedMedia.coverImage} 
            alt={formattedMedia.title} 
            className="w-24 h-36 object-cover rounded-lg border border-border shadow-lg"
          />
          <div>
            <h1 className={cn("text-2xl font-bold", enhanceTextVisibility('strong'))}>{formattedMedia.title}</h1>
            <div className="flex items-center mt-1 text-white/90">
              {formattedMedia.year && <span className="text-sm mr-3">{formattedMedia.year}</span>}
              {formattedMedia.rating && (
                <div className="flex items-center mr-3">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                  <span className="text-sm">{formattedMedia.rating}</span>
                </div>
              )}
              {formattedMedia.duration && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-white/80 mr-1" />
                  <span className="text-sm">{formattedMedia.duration}</span>
                </div>
              )}
            </div>
            {formattedMedia.genres && formattedMedia.genres.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {formattedMedia.genres.map((genre: string) => (
                  <Badge 
                    key={genre} 
                    variant="outline" 
                    className={cn(
                      "text-xs py-0",
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
    </div>
  );
}
