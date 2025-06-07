
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface RatingSliderProps {
  value: number;
  onChange: (rating: number) => void;
}

export function RatingSlider({ value, onChange }: RatingSliderProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-500 border-green-500/40 bg-green-500/20";
    if (rating >= 6) return "text-yellow-500 border-yellow-500/40 bg-yellow-500/20";
    if (rating >= 4) return "text-orange-500 border-orange-500/40 bg-orange-500/20";
    return "text-red-500 border-red-500/40 bg-red-500/20";
  };

  const getSliderColor = (rating: number) => {
    if (rating >= 8) return "[&_[data-orientation=horizontal]]:bg-green-500";
    if (rating >= 6) return "[&_[data-orientation=horizontal]]:bg-yellow-500";
    if (rating >= 4) return "[&_[data-orientation=horizontal]]:bg-orange-500";
    return "[&_[data-orientation=horizontal]]:bg-red-500";
  };

  return (
    <FormItem className="space-y-4">
      <div className="flex items-center justify-between">
        <FormLabel className="text-sm font-medium">Note</FormLabel>
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-lg transition-colors",
          getRatingColor(value)
        )}>
          {value}
        </div>
      </div>
      
      <FormControl>
        <div className="space-y-2">
          <Slider
            value={[value]}
            max={10}
            min={0}
            step={1}
            onValueChange={(vals) => onChange(vals[0])}
            className={cn("w-full", getSliderColor(value))}
          />
          <div className="flex justify-between text-xs text-muted-foreground px-2">
            <span>0</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>
      </FormControl>
    </FormItem>
  );
}
