
import { useState, useEffect } from "react";

interface GameProgressionData {
  completion_percentage: number;
  playtime: number;
  status: 'to-play' | 'playing' | 'completed';
}

export function useGameProgression(
  initialProgression: any,
  onProgressionUpdate: (progression: any) => void
) {
  const [completionPercentage, setCompletionPercentage] = useState(
    initialProgression?.completion_percentage || 0
  );
  const [playtime, setPlaytime] = useState(initialProgression?.playtime || 0);
  const [status, setStatus] = useState(initialProgression?.status || 'to-play');

  useEffect(() => {
    // Update when external progression changes
    if (initialProgression) {
      setCompletionPercentage(initialProgression.completion_percentage || 0);
      setPlaytime(initialProgression.playtime || 0);
      setStatus(initialProgression.status || 'to-play');
    }
  }, [initialProgression]);

  const updateCompletionPercentage = (value: number[]) => {
    const newPercentage = value[0];
    setCompletionPercentage(newPercentage);
    
    let newStatus = status;
    if (newPercentage === 0) {
      newStatus = 'to-play';
    } else if (newPercentage === 100) {
      newStatus = 'completed';
    } else {
      newStatus = 'playing';
    }
    
    setStatus(newStatus);
    updateProgression(newPercentage, playtime, newStatus);
  };

  const updatePlaytime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlaytime = parseInt(e.target.value) || 0;
    setPlaytime(newPlaytime);
    
    let newStatus = status;
    if (newPlaytime === 0 && completionPercentage === 0) {
      newStatus = 'to-play';
    } else if (completionPercentage === 100) {
      newStatus = 'completed';
    } else if (newPlaytime > 0 || completionPercentage > 0) {
      newStatus = 'playing';
    }
    
    setStatus(newStatus);
    updateProgression(completionPercentage, newPlaytime, newStatus);
  };

  const updateStatus = (newStatus: 'to-play' | 'playing' | 'completed') => {
    setStatus(newStatus);
    
    let newCompletionPercentage = completionPercentage;
    
    if (newStatus === 'completed') {
      newCompletionPercentage = 100;
    } else if (newStatus === 'to-play') {
      newCompletionPercentage = 0;
    } else if (newStatus === 'playing' && completionPercentage === 0) {
      newCompletionPercentage = 1;
    }
    
    setCompletionPercentage(newCompletionPercentage);
    updateProgression(newCompletionPercentage, playtime, newStatus);
  };

  const updateProgression = (
    completion_percentage: number,
    playtime: number,
    status: 'to-play' | 'playing' | 'completed'
  ) => {
    onProgressionUpdate({
      ...initialProgression,
      completion_percentage,
      playtime,
      status
    });
  };

  return {
    completionPercentage,
    playtime,
    status,
    updateCompletionPercentage,
    updatePlaytime,
    updateStatus
  };
}
