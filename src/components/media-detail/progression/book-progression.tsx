
import React from "react";
import { BookStatusSelector } from "./book/book-status-selector";
import { PageTracker } from "./book/page-tracker";
import { useBookProgression } from "./book/use-book-progression";

interface BookProgressionProps {
  mediaDetails: any;
  progression: any;
  onUpdate: (progression: any) => void;
}

export function BookProgression({ mediaDetails, progression, onUpdate }: BookProgressionProps) {
  const {
    currentPage,
    totalPages,
    status,
    updateCurrentPage,
    saveCurrentPage,
    updateStatus
  } = useBookProgression(progression, mediaDetails, onUpdate);

  // Create event handlers that extract the values from events
  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCurrentPage(Number(e.target.value));
  };

  const handlePageBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    saveCurrentPage(Number(e.target.value));
  };

  return (
    <div className="space-y-6">
      <BookStatusSelector 
        status={status} 
        onStatusChange={updateStatus} 
      />

      <PageTracker 
        currentPage={currentPage}
        totalPages={totalPages}
        onCurrentPageChange={handlePageChange}
        onCurrentPageBlur={handlePageBlur}
      />
    </div>
  );
}
