
import React from "react";
import { Input } from "@/components/ui/input";
import { Timer } from "lucide-react";

interface PlaytimeTrackerProps {
  playtime: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  estimatedTime?: number | null;
}

export function PlaytimeTracker({ 
  playtime, 
  onChange,
  estimatedTime
}: PlaytimeTrackerProps) {
  return (
    <div>
      <label htmlFor="playtime" className="block text-sm text-muted-foreground mb-1">
        Temps de jeu (heures)
      </label>
      <div className="flex items-center">
        <Input
          id="playtime"
          type="number"
          min={0}
          value={playtime}
          onChange={onChange}
          className="w-full"
        />
        <Timer className="h-4 w-4 ml-2 text-muted-foreground" />
      </div>
      {estimatedTime && (
        <p className="mt-1 text-xs text-muted-foreground">
          Temps estimé pour terminer le jeu: {estimatedTime} heures
        </p>
      )}
    </div>
  );
}
