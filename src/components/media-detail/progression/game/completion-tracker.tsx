
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Trophy } from "lucide-react";

interface CompletionTrackerProps {
  completionPercentage: number;
  onCompletionChange: (value: number[]) => void;
}

export function CompletionTracker({ 
  completionPercentage, 
  onCompletionChange 
}: CompletionTrackerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center mb-2">
        <Trophy className="h-5 w-5 mr-2 text-primary" />
        <span className="font-medium">Avancement du jeu</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Pourcentage de complétion</span>
          <span className="text-sm font-medium">{completionPercentage}%</span>
        </div>
        
        <Slider
          value={[completionPercentage]}
          max={100}
          step={1}
          onValueChange={onCompletionChange}
          className="py-2"
        />
        
        <Progress 
          value={completionPercentage} 
          className="h-2 bg-secondary/30"
        />
      </div>
    </div>
  );
}
