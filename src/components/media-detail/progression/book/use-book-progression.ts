
import { useState, useCallback } from "react";
import { BookChapter } from "@/types/book";

export function useBookProgression(progression: any, mediaDetails: any, onUpdate: (progression: any) => void) {
  const [currentPage, setCurrentPage] = useState(progression?.currentPage || 0);
  const [status, setStatus] = useState(progression?.status || "to-read");
  
  const totalPages = mediaDetails?.pages || 0;
  const chapters = mediaDetails?.tableOfContents || [];

  const updateCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const saveCurrentPage = useCallback((page: number) => {
    const newProgression = {
      ...progression,
      currentPage: page,
      lastUpdated: new Date().toISOString()
    };
    onUpdate(newProgression);
  }, [progression, onUpdate]);

  const updateStatus = useCallback((newStatus: string) => {
    const newProgression = {
      ...progression,
      status: newStatus,
      lastUpdated: new Date().toISOString()
    };
    setStatus(newStatus);
    onUpdate(newProgression);
  }, [progression, onUpdate]);

  const goToChapter = useCallback((chapter: BookChapter) => {
    updateCurrentPage(chapter.pageStart);
    saveCurrentPage(chapter.pageStart);
  }, [updateCurrentPage, saveCurrentPage]);

  return {
    currentPage,
    totalPages,
    status,
    chapters,
    updateCurrentPage,
    saveCurrentPage,
    updateStatus,
    goToChapter
  };
}
