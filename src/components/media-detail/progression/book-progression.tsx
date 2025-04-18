
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

  return (
    <div className="space-y-6">
      <BookStatusSelector 
        status={status} 
        onStatusChange={updateStatus} 
      />

      <PageTracker 
        currentPage={currentPage}
        totalPages={totalPages}
        onCurrentPageChange={updateCurrentPage}
        onCurrentPageBlur={saveCurrentPage}
      />
    </div>
  );
}
