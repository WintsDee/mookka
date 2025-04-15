
import React from "react";
import { cn } from "@/lib/utils";

interface MediaRatingBadgeProps {
  rating: number;
  label?: string;
  size?: "small" | "medium" | "large";
}

export function MediaRatingBadge({ rating, label, size = "medium" }: MediaRatingBadgeProps) {
  // Format rating to one decimal place if needed
  const formattedRating = typeof rating === 'number' 
    ? (rating % 1 === 0 ? rating.toString() : rating.toFixed(1))
    : rating;
    
  // Generate color based on rating
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
    <div className="flex flex-col items-center">
      {label && (
        <span className="text-[10px] text-white font-semibold mb-0.5 drop-shadow-md">
          {label}
        </span>
      )}
      <div 
        className={cn(
          "flex items-center justify-center rounded-md font-bold shadow-md",
          getColorClass(Number(rating)),
          sizeClasses[size]
        )}
      >
        {formattedRating}
      </div>
    </div>
  );
}
