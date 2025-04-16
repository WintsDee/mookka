
import React from "react";
import { cn } from "@/lib/utils";

interface MediaRatingBadgeProps {
  rating: number;
  size?: "small" | "medium" | "large";
  maxRating?: number;
  className?: string;
}

export function MediaRatingBadge({ 
  rating, 
  size = "medium", 
  maxRating = 10,
  className
}: MediaRatingBadgeProps) {
  // Normalize rating to scale of 10 if necessary
  const normalizedRating = maxRating !== 10 
    ? (rating / maxRating) * 10
    : rating;
  
  // Format normalized rating to one decimal place (or as integer if it's a whole number)
  const formattedRating = normalizedRating % 1 === 0 
    ? normalizedRating.toString() 
    : normalizedRating.toFixed(1);
    
  // Generate color based on normalized rating
  const getColorClass = (rating: number) => {
    if (rating < 5) return "bg-destructive text-white";
    if (rating < 7) return "bg-amber-500 text-white";
    return "bg-emerald-500 text-white";
  };
  
  // Size classes
  const sizeClasses = {
    small: "text-xs p-1 min-w-8",
    medium: "text-sm py-1 px-2 min-w-10",
    large: "text-base py-1.5 px-3 min-w-12"
  };
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center rounded-md font-bold shadow-md",
        getColorClass(Number(normalizedRating)),
        sizeClasses[size],
        className
      )}
    >
      {formattedRating}
    </div>
  );
}
