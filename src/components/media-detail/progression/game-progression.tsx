
import React from "react";
import { GameStatusSelector } from "./game/game-status-selector";
import { CompletionTracker } from "./game/completion-tracker";
import { PlaytimeTracker } from "./game/playtime-tracker";
import { useGameProgression } from "./game/use-game-progression";

interface GameProgressionProps {
  mediaDetails: any;
  progression: any;
  onUpdate: (progression: any) => void;
}

export function GameProgression({ mediaDetails, progression, onUpdate }: GameProgressionProps) {
  const {
    completionPercentage,
    playtime,
    status,
    updateCompletionPercentage,
    updatePlaytime,
    updateStatus
  } = useGameProgression(progression, onUpdate);

  return (
    <div className="space-y-6">
      <GameStatusSelector
        status={status}
        onStatusChange={updateStatus}
      />

      <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4 space-y-4">
        <CompletionTracker
          completionPercentage={completionPercentage}
          onCompletionChange={updateCompletionPercentage}
        />
        
        <PlaytimeTracker
          playtime={playtime}
          onPlaytimeChange={updatePlaytime}
        />
      </div>
    </div>
  );
}
