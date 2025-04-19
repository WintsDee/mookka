
import React from "react";
import { FilmStatusSelector } from "./film/film-status-selector";
import { WatchProgressTracker } from "./film/watch-progress-tracker";
import { useFilmProgression } from "./film/use-film-progression";
import { NotesTextarea } from "./notes-textarea";

interface FilmProgressionProps {
  mediaDetails: any;
  progression: any;
  onUpdate: (progression: any) => void;
}

export function FilmProgression({ mediaDetails, progression, onUpdate }: FilmProgressionProps) {
  const totalDuration = mediaDetails?.runtime ? parseInt(mediaDetails.runtime) : 0;
  
  const {
    watched,
    watchTime,
    status,
    notes,
    updateWatched,
    updateWatchTime,
    updateStatus,
    updateNotes
  } = useFilmProgression(progression, onUpdate, totalDuration);

  return (
    <div className="space-y-6">
      <FilmStatusSelector
        status={status}
        onStatusChange={updateStatus}
      />

      <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4 space-y-4">
        <WatchProgressTracker
          watched={watched}
          watchTime={watchTime}
          totalDuration={totalDuration}
          onWatchedChange={updateWatched}
          onWatchTimeChange={updateWatchTime}
        />
        
        <NotesTextarea 
          notes={notes || ""} 
          onNotesChange={updateNotes}
          placeholder="Notez vos impressions sur ce film, où vous vous êtes arrêté, etc."
        />
      </div>
    </div>
  );
}
