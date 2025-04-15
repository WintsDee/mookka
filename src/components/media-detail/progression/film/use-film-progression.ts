
import { useState, useEffect } from "react";

interface FilmProgressionData {
  watched: boolean;
  watch_time: number;
  status: 'to-watch' | 'watching' | 'completed';
}

export function useFilmProgression(
  initialProgression: any,
  onProgressionUpdate: (progression: any) => void,
  totalDuration: number = 0
) {
  const [watched, setWatched] = useState(initialProgression?.watched || false);
  const [watchTime, setWatchTime] = useState(initialProgression?.watch_time || 0);
  const [status, setStatus] = useState(initialProgression?.status || 'to-watch');

  useEffect(() => {
    // Update when external progression changes
    if (initialProgression) {
      setWatched(initialProgression.watched || false);
      setWatchTime(initialProgression.watch_time || 0);
      setStatus(initialProgression.status || 'to-watch');
    }
  }, [initialProgression]);

  const updateWatched = (isWatched: boolean) => {
    setWatched(isWatched);
    let newStatus = status;
    
    if (isWatched) {
      setWatchTime(totalDuration);
      newStatus = 'completed';
    } else {
      setWatchTime(0);
      newStatus = 'to-watch';
    }
    
    setStatus(newStatus);
    updateProgression(isWatched, isWatched ? totalDuration : 0, newStatus);
  };

  const updateWatchTime = (time: number[]) => {
    const newTime = time[0];
    setWatchTime(newTime);
    
    let newStatus = 'to-watch';
    let newWatched = false;
    
    if (newTime === 0) {
      newStatus = 'to-watch';
      newWatched = false;
    } else if (newTime === totalDuration) {
      newStatus = 'completed';
      newWatched = true;
    } else {
      newStatus = 'watching';
      newWatched = false;
    }
    
    setWatched(newWatched);
    setStatus(newStatus);
    updateProgression(newWatched, newTime, newStatus);
  };

  const updateStatus = (newStatus: 'to-watch' | 'watching' | 'completed') => {
    setStatus(newStatus);
    
    let newWatched = watched;
    let newWatchTime = watchTime;
    
    if (newStatus === 'completed') {
      newWatched = true;
      newWatchTime = totalDuration;
    } else if (newStatus === 'to-watch') {
      newWatched = false;
      newWatchTime = 0;
    }
    
    setWatched(newWatched);
    setWatchTime(newWatchTime);
    updateProgression(newWatched, newWatchTime, newStatus);
  };

  const updateProgression = (
    watched: boolean,
    watch_time: number,
    status: 'to-watch' | 'watching' | 'completed'
  ) => {
    onProgressionUpdate({
      ...initialProgression,
      watched,
      watch_time,
      status
    });
  };

  return {
    watched,
    watchTime,
    status,
    updateWatched,
    updateWatchTime,
    updateStatus
  };
}
