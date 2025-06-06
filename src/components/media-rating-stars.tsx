
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
  const sizeClasses = {
    small: "w-3 h-3",
    medium: "w-4 h-4", 
    large: "w-5 h-5"
  };
  
  const containerClasses = {
    small: "gap-0.5 text-xs",
    medium: "gap-1 text-sm",
    large: "gap-1.5 text-base"
  };

  // Calculer le nombre d'étoiles pleines (sur 5 étoiles)
  const starRating = Math.round((rating / 10) * 5);
  
  return (
    <div className={cn(
      "flex items-center whitespace-nowrap min-w-0", 
      containerClasses[size], 
      className
    )}>
      <div className={cn("flex items-center flex-shrink-0", containerClasses[size])}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
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
          "font-medium text-primary ml-1 flex-shrink-0", 
          containerClasses[size].split(' ')[1]
        )}>
          {rating}/10
        </span>
      )}
    </div>
  );
}
