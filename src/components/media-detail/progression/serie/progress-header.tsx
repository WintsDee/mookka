
import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressHeaderProps {
  currentCount: number;
  totalCount: number;
}

export function ProgressHeader({ currentCount, totalCount }: ProgressHeaderProps) {
  const progressPercentage = totalCount > 0 ? (currentCount / totalCount) * 100 : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Progression</h3>
        <span className="text-sm text-muted-foreground">{currentCount}/{totalCount} épisodes</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
}
