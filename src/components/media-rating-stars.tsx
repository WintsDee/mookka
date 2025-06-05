
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
    small: "gap-0.5",
    medium: "gap-1",
    large: "gap-1"
  };

  const textClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base"
  };

  // Calculer le nombre d'étoiles pleines (sur 5 étoiles)
  const starRating = Math.round((rating / 10) * 5);
  
  return (
    <div className={cn("flex items-center", containerClasses[size], className)}>
      <div className={cn("flex", containerClasses[size])}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= starRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
      {showNumber && (
        <span className={cn("font-medium text-yellow-600 ml-1", textClasses[size])}>
          {rating}/10
        </span>
      )}
    </div>
  );
}
