
import { useState, useRef, useEffect } from "react";

interface BookProgressionState {
  currentPage: number;
  totalPages: number;
  status: string;
}

export function useBookProgression(
  initialProgression: any,
  mediaDetails: any,
  onUpdate: (progression: any) => void
) {
  const [state, setState] = useState<BookProgressionState>({
    currentPage: initialProgression?.current_page || 0,
    totalPages: initialProgression?.total_pages || mediaDetails?.pages || 0,
    status: initialProgression?.status || 'to-read'
  });
  
  // Reference to track if component is in initial mount phase
  const initialMount = useRef(true);
  
  // Update when external progression changes
  useEffect(() => {
    if (initialProgression) {
      setState({
        currentPage: initialProgression.current_page || 0,
        totalPages: initialProgression.total_pages || mediaDetails?.pages || 0,
        status: initialProgression.status || 'to-read'
      });
    }
  }, [initialProgression, mediaDetails]);
  
  // Skip initial update to prevent unnecessary API calls
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
    }
  }, []);
  
  const updateCurrentPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPage = parseInt(e.target.value) || 0;
    const validPage = Math.min(Math.max(0, newPage), state.totalPages);
    setState(prev => ({ ...prev, currentPage: validPage }));
  };
  
  const saveCurrentPage = (e: React.FocusEvent<HTMLInputElement>) => {
    const validPage = Math.min(Math.max(0, state.currentPage), state.totalPages);
    
    let newStatus = state.status;
    if (validPage === 0) {
      newStatus = 'to-read';
    } else if (validPage === state.totalPages) {
      newStatus = 'completed';
    } else if (validPage > 0) {
      newStatus = 'reading';
    }
    
    setState(prev => ({ 
      ...prev, 
      currentPage: validPage, 
      status: newStatus 
    }));
    
    onUpdate({
      ...initialProgression,
      current_page: validPage,
      total_pages: state.totalPages,
      status: newStatus
    });
  };
  
  const updateStatus = (newStatus: string) => {
    let newCurrentPage = state.currentPage;
    
    if (newStatus === 'completed') {
      newCurrentPage = state.totalPages;
    } else if (newStatus === 'to-read') {
      newCurrentPage = 0;
    } else if (newStatus === 'reading' && state.currentPage === 0) {
      newCurrentPage = 1;
    }
    
    setState(prev => ({ 
      ...prev, 
      currentPage: newCurrentPage, 
      status: newStatus 
    }));
    
    onUpdate({
      ...initialProgression,
      current_page: newCurrentPage,
      total_pages: state.totalPages,
      status: newStatus
    });
  };
  
  return {
    ...state,
    updateCurrentPage,
    saveCurrentPage,
    updateStatus
  };
}
