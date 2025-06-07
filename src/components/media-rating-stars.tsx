
import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaRatingStarsProps {
  rating: number;
  size?: "small" | "medium" | "large";
  showNumber?: boolean;
  className?: string;
}

export function MediaRatingStars({ 
  rating, 
  size = "small", 
  showNumber = true,
  className 
}: MediaRatingStarsProps) {
  const sizeConfig = {
    small: {
      star: "w-2.5 h-2.5 sm:w-3 sm:h-3",
      gap: "gap-0.5",
      text: "text-xs",
      spacing: "ml-1"
    },
    medium: {
      star: "w-3 h-3 sm:w-4 sm:h-4",
      gap: "gap-0.5 sm:gap-1",
      text: "text-xs sm:text-sm",
      spacing: "ml-1 sm:ml-1.5"
    },
    large: {
      star: "w-4 h-4 sm:w-5 sm:h-5",
      gap: "gap-1 sm:gap-1.5",
      text: "text-sm sm:text-base",
      spacing: "ml-1.5 sm:ml-2"
    }
  };

  const config = sizeConfig[size];

  // Calculer le nombre d'étoiles pleines (sur 5 étoiles)
  const starRating = Math.round((rating / 10) * 5);
  
  return (
    <div className={cn(
      "flex items-center whitespace-nowrap min-w-0 flex-shrink-0", 
      config.gap,
      config.text,
      className
    )}>
      <div className={cn("flex items-center flex-shrink-0", config.gap)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              config.star,
              "transition-all duration-200 flex-shrink-0",
              star <= starRating
                ? "fill-primary text-primary drop-shadow-sm"
                : "text-muted-foreground/40"
            )}
          />
        ))}
      </div>
      {showNumber && (
        <span className={cn(
          "font-medium text-primary flex-shrink-0 truncate", 
          config.text,
          config.spacing
        )}>
          {rating}/10
        </span>
      )}
    </div>
  );
}
