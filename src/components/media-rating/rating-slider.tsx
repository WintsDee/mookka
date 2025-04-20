
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface RatingSliderProps {
  userRating: number;
  onRatingChange: (rating: number) => void;
}

export function RatingSlider({ userRating, onRatingChange }: RatingSliderProps) {
  return (
    <FormItem>
      <div className="flex items-center justify-between mb-2">
        <FormLabel className="text-sm">Note</FormLabel>
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full border",
          userRating >= 7 ? "bg-green-500/20 border-green-500/40 text-green-400" :
          userRating >= 4 ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400" :
          "bg-red-500/20 border-red-500/40 text-red-400"
        )}>
          <span className="font-bold">{userRating}</span>
        </div>
      </div>
      <FormControl>
        <Slider
          defaultValue={[userRating]}
          max={10}
          step={1}
          onValueChange={(vals) => {
            onRatingChange(vals[0]);
          }}
          className="py-4"
        />
      </FormControl>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </FormItem>
  );
}
