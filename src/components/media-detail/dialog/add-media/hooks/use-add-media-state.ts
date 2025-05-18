
import { MediaStatus, MediaType } from "@/types";
import { useMediaForm } from "./use-media-form";
import { useErrorHandling } from "./use-error-handling";
import { useMediaApi } from "./use-media-api";
import { useAuthCheck } from "./use-auth-check";
import { useDialogFlow } from "./use-dialog-flow";

interface UseAddMediaStateProps {
  mediaId: string;
  mediaType: MediaType;
  mediaTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function useAddMediaState({
  mediaId,
  mediaType,
  mediaTitle,
  isOpen,
  onOpenChange
}: UseAddMediaStateProps) {
  // Set up all the smaller hooks
  const {
    selectedStatus,
    notes,
    showRatingStep,
    isComplete,
    showSuccessAnimation,
    handleStatusSelect,
    handleNotesChange,
    showRating,
    showSuccess,
    completeForm
  } = useMediaForm({ mediaType, isOpen });

  const { errorMessage, isRetrying, handleError, clearError } = useErrorHandling({ 
    mediaTitle, 
    onOpenChange 
  });

  const { isAddingToLibrary, addToLibrary, addRating } = useMediaApi({ 
    mediaId, 
    mediaType, 
    mediaTitle 
  });

  const { verifyAuth } = useAuthCheck({ 
    isOpen, 
    onAuthError: (message) => handleError(new Error(message)) 
  });

  const { goToLibrary, autoClose } = useDialogFlow({ onOpenChange });

  // Handler for form submission
  const handleAddToLibrary = async () => {
    // Verify user is authenticated
    if (!verifyAuth()) return;
    
    // Validate form data
    if (!selectedStatus) {
      handleError(new Error("Veuillez sélectionner un statut"));
      return;
    }
    
    // Clear any previous errors
    clearError();
    
    try {
      // If status is completed, we'll show the rating step
      if (selectedStatus === 'completed') {
        // First add the media without rating
        await addToLibrary(selectedStatus, notes);
        showRating();
        return;
      }
      
      // For other statuses, add directly to library
      await addToLibrary(selectedStatus, notes);
      
      // Show success animation
      showSuccess();
      
      // After a delay, complete the form and close
      setTimeout(() => {
        completeForm();
        autoClose(1500);
      }, 1000);
      
    } catch (error) {
      handleError(error, handleAddToLibrary);
    }
  };

  // Handler for rating submission
  const handleRatingComplete = async (rating?: number) => {
    try {
      await addRating(notes, rating);
      
      showSuccess();
      
      // After a delay, complete the form and close
      setTimeout(() => {
        completeForm();
        autoClose(1500);
      }, 1000);
      
    } catch (error) {
      handleError(error);
    }
  };

  return {
    selectedStatus,
    notes,
    isAddingToLibrary,
    showRatingStep,
    isComplete,
    showSuccessAnimation,
    errorMessage,
    handleStatusSelect,
    handleNotesChange,
    handleAddToLibrary,
    handleRatingComplete,
    handleViewLibrary: goToLibrary
  };
}
