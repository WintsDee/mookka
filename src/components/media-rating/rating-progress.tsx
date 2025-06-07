
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface RatingProgressProps {
  value: number;
  onChange: (rating: number) => void;
}

export function RatingProgress({ value, onChange }: RatingProgressProps) {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const newRating = Math.max(1, Math.min(10, Math.round((x / width) * 10)));
    onChange(newRating);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 7) return "text-green-600";
    if (rating >= 4) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 7) return "bg-green-100 border-green-200";
    if (rating >= 4) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  return (
    <FormItem>
      <div className="flex items-center justify-between mb-2">
        <FormLabel className="text-sm">Note</FormLabel>
        <div className={cn(
          "flex items-center justify-center px-3 py-1 rounded-full border text-sm font-semibold",
          getRatingColor(value),
          getRatingBg(value)
        )}>
          {value}/10
        </div>
      </div>
      <FormControl>
        <div 
          className="cursor-pointer py-2"
          onClick={handleClick}
        >
          <Progress 
            value={value * 10} 
            className="h-3 cursor-pointer"
          />
        </div>
      </FormControl>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </FormItem>
  );
}
