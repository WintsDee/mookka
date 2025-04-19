
import { useState, useEffect } from "react";
import { MediaStatus } from "@/types";

export function useBookProgression(
  initialProgression: any,
  onProgressionUpdate: (progression: any) => void,
  totalPages: number = 0
) {
  const [currentPage, setCurrentPage] = useState(initialProgression?.current_page || 0);
  const [status, setStatus] = useState<MediaStatus>(initialProgression?.status || 'to-read');
  const [notes, setNotes] = useState<string>(initialProgression?.notes || '');

  useEffect(() => {
    // Update when external progression changes
    if (initialProgression) {
      setCurrentPage(initialProgression.current_page || 0);
      setStatus(initialProgression.status || 'to-read');
      setNotes(initialProgression.notes || '');
    }
  }, [initialProgression]);

  const updateCurrentPage = (page: number) => {
    setCurrentPage(page);
    
    let newStatus: MediaStatus = status;
    
    if (page === 0) {
      newStatus = 'to-read';
    } else if (page === totalPages) {
      newStatus = 'completed';
    } else {
      newStatus = 'reading';
    }
    
    setStatus(newStatus);
    updateProgression(page, newStatus, notes);
  };

  const updateStatus = (newStatus: MediaStatus) => {
    setStatus(newStatus);
    
    let newPage = currentPage;
    
    if (newStatus === 'completed') {
      newPage = totalPages;
    } else if (newStatus === 'to-read') {
      newPage = 0;
    }
    
    setCurrentPage(newPage);
    updateProgression(newPage, newStatus, notes);
  };
  
  const updateNotes = (newNotes: string) => {
    setNotes(newNotes);
    updateProgression(currentPage, status, newNotes);
  };

  const updateProgression = (
    current_page: number,
    status: MediaStatus,
    notes: string
  ) => {
    onProgressionUpdate({
      ...initialProgression,
      current_page,
      status,
      total_pages: totalPages,
      notes
    });
  };

  return {
    currentPage,
    status,
    notes,
    updateCurrentPage,
    updateStatus,
    updateNotes
  };
}
