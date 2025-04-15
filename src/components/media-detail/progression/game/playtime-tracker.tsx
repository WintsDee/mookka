
import React from "react";
import { Input } from "@/components/ui/input";
import { Timer } from "lucide-react";

interface PlaytimeTrackerProps {
  playtime: number;
  onPlaytimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PlaytimeTracker({ playtime, onPlaytimeChange }: PlaytimeTrackerProps) {
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
          onChange={onPlaytimeChange}
          className="w-full"
        />
        <Timer className="h-4 w-4 ml-2 text-muted-foreground" />
      </div>
    </div>
  );
}
