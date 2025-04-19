
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

  const handlePlaytimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePlaytime(parseInt(e.target.value));
  };

  return (
    <div className="space-y-6">
      <GameStatusSelector
        status={status}
        onStatusChange={updateStatus}
      />

      <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4 space-y-5">
        <CompletionTracker
          completionPercentage={completionPercentage}
          onChange={(values: number[]) => updateCompletionPercentage(values[0])}
        />
        
        <PlaytimeTracker
          playtime={playtime}
          estimatedTime={estimatedCompletionTime}
          onChange={handlePlaytimeChange}
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
