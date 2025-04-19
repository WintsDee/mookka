
import React from "react";
import { BookStatusSelector } from "./book/book-status-selector";
import { PageTracker } from "./book/page-tracker";
import { useBookProgression } from "./book/use-book-progression";
import { NotesTextarea } from "./notes-textarea";

interface BookProgressionProps {
  mediaDetails: any;
  progression: any;
  onUpdate: (progression: any) => void;
}

export function BookProgression({ mediaDetails, progression, onUpdate }: BookProgressionProps) {
  const totalPages = mediaDetails?.page_count ? parseInt(mediaDetails.page_count) : 0;
  
  const {
    currentPage,
    status,
    notes,
    updateCurrentPage,
    updateStatus,
    updateNotes
  } = useBookProgression(progression, onUpdate, totalPages);

  return (
    <div className="space-y-6">
      <BookStatusSelector
        status={status}
        onStatusChange={updateStatus}
      />

      <div className="bg-card/30 backdrop-blur-sm border border-border/40 rounded-lg p-4 space-y-4">
        <PageTracker
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={updateCurrentPage}
        />
        
        <NotesTextarea 
          notes={notes || ""} 
          onNotesChange={updateNotes}
          placeholder="Notez vos impressions sur ce livre, les citations marquantes, etc."
        />
      </div>
    </div>
  );
}
