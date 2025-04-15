
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Timer } from "lucide-react";

interface WatchProgressTrackerProps {
  watched: boolean;
  watchTime: number;
  totalDuration: number;
  onWatchedChange: (checked: boolean) => void;
  onWatchTimeChange: (value: number[]) => void;
}

export function WatchProgressTracker({ 
  watched, 
  watchTime, 
  totalDuration, 
  onWatchedChange,
  onWatchTimeChange
}: WatchProgressTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Checkbox 
            id="film-watched"
            checked={watched}
            onCheckedChange={(checked) => onWatchedChange(checked as boolean)}
            className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
          />
          <label 
            htmlFor="film-watched"
            className="font-medium cursor-pointer"
          >
            J'ai vu ce film
          </label>
        </div>
        
        {totalDuration > 0 && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Timer className="h-4 w-4 mr-1" />
            Durée: {totalDuration} minutes
          </div>
        )}
      </div>

      {totalDuration > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progression dans le film</span>
            <span className="text-sm font-medium">
              {watchTime} / {totalDuration} minutes ({Math.round((watchTime / totalDuration) * 100)}%)
            </span>
          </div>
          
          <Slider
            value={[watchTime]}
            max={totalDuration}
            step={1}
            onValueChange={onWatchTimeChange}
            className="py-2"
          />
          
          <Progress 
            value={totalDuration > 0 ? (watchTime / totalDuration) * 100 : 0} 
            className="h-2 bg-secondary/30"
          />
        </div>
      )}
    </div>
  );
}
