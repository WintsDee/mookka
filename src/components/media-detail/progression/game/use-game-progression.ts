
import { useState, useEffect } from "react";
import { MediaStatus } from "@/types";

export function useGameProgression(
  initialProgression: any,
  onProgressionUpdate: (progression: any) => void
) {
  const [completionPercentage, setCompletionPercentage] = useState(initialProgression?.completion_percentage || 0);
  const [playtime, setPlaytime] = useState(initialProgression?.playtime || 0);
  const [status, setStatus] = useState<MediaStatus>(initialProgression?.status || 'to-play');
  const [notes, setNotes] = useState<string>(initialProgression?.notes || '');

  useEffect(() => {
    // Update when external progression changes
    if (initialProgression) {
      setCompletionPercentage(initialProgression.completion_percentage || 0);
      setPlaytime(initialProgression.playtime || 0);
      setStatus(initialProgression.status || 'to-play');
      setNotes(initialProgression.notes || '');
    }
  }, [initialProgression]);

  const updateCompletionPercentage = (percentage: number) => {
    setCompletionPercentage(percentage);
    
    let newStatus: MediaStatus = status;
    
    if (percentage === 0) {
      newStatus = 'to-play';
    } else if (percentage === 100) {
      newStatus = 'completed';
    } else {
      newStatus = 'playing';
    }
    
    setStatus(newStatus);
    updateProgression(percentage, playtime, newStatus, notes);
  };

  const updatePlaytime = (hours: number) => {
    setPlaytime(hours);
    updateProgression(completionPercentage, hours, status, notes);
  };

  const updateStatus = (newStatus: MediaStatus) => {
    setStatus(newStatus);
    
    let newPercentage = completionPercentage;
    
    if (newStatus === 'completed') {
      newPercentage = 100;
    } else if (newStatus === 'to-play') {
      newPercentage = 0;
    }
    
    setCompletionPercentage(newPercentage);
    updateProgression(newPercentage, playtime, newStatus, notes);
  };
  
  const updateNotes = (newNotes: string) => {
    setNotes(newNotes);
    updateProgression(completionPercentage, playtime, status, newNotes);
  };

  const updateProgression = (
    completion_percentage: number,
    playtime: number,
    status: MediaStatus,
    notes: string
  ) => {
    onProgressionUpdate({
      ...initialProgression,
      completion_percentage,
      playtime,
      status,
      notes
    });
  };

  return {
    completionPercentage,
    playtime,
    status,
    notes,
    updateCompletionPercentage,
    updatePlaytime,
    updateStatus,
    updateNotes
  };
}
