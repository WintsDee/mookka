
import React from 'react';
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface EnhancedRatingSliderProps {
  value: number;
  onChange: (rating: number) => void;
  className?: string;
}

export function EnhancedRatingSlider({ value, onChange, className }: EnhancedRatingSliderProps) {
  const handleStarClick = (rating: number) => {
    onChange(rating);
  };

  const getStarColor = (starIndex: number) => {
    if (starIndex <= value) {
      if (value >= 8) return "text-green-500 fill-green-500";
      if (value >= 6) return "text-yellow-500 fill-yellow-500";
      if (value >= 4) return "text-orange-500 fill-orange-500";
      return "text-red-500 fill-red-500";
    }
    return "text-muted-foreground";
  };

  const getRatingText = () => {
    if (value === 0) return "Pas encore noté";
    if (value >= 9) return "Chef-d'œuvre";
    if (value >= 8) return "Excellent";
    if (value >= 7) return "Très bon";
    if (value >= 6) return "Bon";
    if (value >= 5) return "Moyen";
    if (value >= 4) return "Passable";
    if (value >= 3) return "Médiocre";
    if (value >= 2) return "Mauvais";
    return "Très mauvais";
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Votre note</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{value}/10</span>
          <span className="text-sm text-muted-foreground">({getRatingText()})</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-1 py-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            className="p-1 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          >
            <Star 
              className={cn(
                "w-6 h-6 transition-colors duration-200",
                getStarColor(star)
              )}
            />
          </button>
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1 - Très mauvais</span>
        <span>5 - Moyen</span>
        <span>10 - Chef-d'œuvre</span>
      </div>
    </div>
  );
}
