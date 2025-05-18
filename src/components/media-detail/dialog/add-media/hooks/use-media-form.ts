
import { useState, useEffect } from "react";
import { MediaStatus, MediaType } from "@/types";

interface UseMediaFormProps {
  mediaType: MediaType;
  isOpen: boolean;
}

export function useMediaForm({ mediaType, isOpen }: UseMediaFormProps) {
  const [selectedStatus, setSelectedStatus] = useState<MediaStatus | null>(null);
  const [notes, setNotes] = useState("");
  const [showRatingStep, setShowRatingStep] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Reset form state when dialog opens
  useEffect(() => {
    if (isOpen) {
      // Select default status based on media type
      let defaultStatus: MediaStatus;
      switch (mediaType) {
        case 'book':
          defaultStatus = 'to-read';
          break;
        case 'game':
          defaultStatus = 'to-play';
          break;
        case 'film':
        case 'serie':
        default:
          defaultStatus = 'to-watch';
      }
      
      setSelectedStatus(defaultStatus);
      setNotes("");
      setShowRatingStep(false);
      setIsComplete(false);
      setShowSuccessAnimation(false);
    }
  }, [isOpen, mediaType]);

  const handleStatusSelect = (status: MediaStatus) => {
    setSelectedStatus(status);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  const showRating = () => {
    setShowRatingStep(true);
  };

  const showSuccess = () => {
    setShowSuccessAnimation(true);
  };

  const completeForm = () => {
    setIsComplete(true);
  };

  const resetForm = () => {
    setSelectedStatus(null);
    setNotes("");
    setShowRatingStep(false);
    setIsComplete(false);
    setShowSuccessAnimation(false);
  };

  return {
    selectedStatus,
    notes,
    showRatingStep,
    isComplete,
    showSuccessAnimation,
    handleStatusSelect,
    handleNotesChange,
    showRating,
    showSuccess,
    completeForm,
    resetForm
  };
}
