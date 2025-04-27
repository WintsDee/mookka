
import { useState, useEffect } from "react";
import { MediaStatus, MediaType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { addMediaToLibrary } from "@/services/media";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedStatus, setSelectedStatus] = useState<MediaStatus | null>(null);
  const [notes, setNotes] = useState("");
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);
  const [showRatingStep, setShowRatingStep] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(null);
      setNotes("");
      setShowRatingStep(false);
      setIsComplete(false);
      setIsAddingToLibrary(false);
      setShowSuccessAnimation(false);
      setUserRating(null);
    }
  }, [isOpen]);

  const handleStatusSelect = (status: MediaStatus) => {
    setSelectedStatus(status);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  const handleAddToLibrary = async () => {
    if (!selectedStatus) return;
    
    setIsAddingToLibrary(true);
    
    try {
      if (selectedStatus === 'completed') {
        setIsAddingToLibrary(false);
        setShowRatingStep(true);
        return;
      }
      
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status: selectedStatus,
        notes
      });
      
      setShowSuccessAnimation(true);
      
      toast({
        title: "Media added",
        description: `"${mediaTitle}" has been added to your library.`
      });
      
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      }, 1000);
      
    } catch (error) {
      console.error("Error adding to library:", error);
      toast({
        title: "Error",
        description: "Unable to add this media to your library",
        variant: "destructive",
      });
      setIsAddingToLibrary(false);
    }
  };

  const handleRatingComplete = async (rating?: number) => {
    if (rating) {
      setUserRating(rating);
    }
    
    try {
      await addMediaToLibrary({
        mediaId,
        mediaType,
        status: 'completed',
        notes,
        rating: rating || undefined
      });
      
      setShowRatingStep(false);
      setShowSuccessAnimation(true);
      
      toast({
        title: "Media added",
        description: `"${mediaTitle}" has been successfully added to your library.`
      });
      
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      }, 1000);
    } catch (error) {
      console.error("Error adding rated media:", error);
      toast({
        title: "Error",
        description: "Unable to add this media to your library",
        variant: "destructive",
      });
    }
  };

  const handleViewLibrary = () => {
    onOpenChange(false);
    navigate('/bibliotheque');
  };

  return {
    selectedStatus,
    notes,
    isAddingToLibrary,
    showRatingStep,
    isComplete,
    showSuccessAnimation,
    userRating,
    handleStatusSelect,
    handleNotesChange,
    handleAddToLibrary,
    handleRatingComplete,
    handleViewLibrary
  };
}
