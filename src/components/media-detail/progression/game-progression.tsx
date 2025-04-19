
import React from "react";
import { GameStatusSelector } from "./game/game-status-selector";
import { CompletionTracker } from "./game/completion-tracker";
import { PlaytimeTracker } from "./game/playtime-tracker";
import { useGameProgression } from "./game/use-game-progression";
import { NotesTextarea } from "./notes-textarea";

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
    notes,
    updateCompletionPercentage,
    updatePlaytime,
    updateStatus,
    updateNotes
  } = useGameProgression(progression, onUpdate);
  
  const estimatedCompletionTime = mediaDetails?.completion_time_main
    ? parseInt(mediaDetails.completion_time_main)
    : null;

  return (
    <div className="space-y-6">
      <GameStatusSelector
        status={status}
        onStatusChange={updateStatus}
      />

      <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4 space-y-5">
        <CompletionTracker
          completionPercentage={completionPercentage}
          onCompletionChange={updateCompletionPercentage}
        />
        
        <PlaytimeTracker
          playtime={playtime}
          estimatedTime={estimatedCompletionTime}
          onPlaytimeChange={updatePlaytime}
        />
        
        <NotesTextarea 
          notes={notes || ""} 
          onNotesChange={updateNotes}
          placeholder="Notez vos impressions sur ce jeu, où vous êtes bloqué, etc."
        />
      </div>
    </div>
  );
}
