
import React, { useCallback, useState } from "react";
import { BookmarkPlus } from "lucide-react";
import { ActionButton } from "./ActionButton";
import { AddMediaDialog } from "./AddMediaDialog";
import { MediaType } from "@/types";
import { useProfile } from "@/hooks/use-profile";
import { useToast } from "@/hooks/use-toast";

/**
 * Button and dialog to add a media to library.
 */
interface AddMediaDialogTriggerProps {
  media: any;
  type: MediaType;
}

export function AddMediaDialogTrigger({ media, type }: AddMediaDialogTriggerProps) {
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useProfile();

  const handleAddClick = useCallback(() => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter un média à votre bibliothèque",
        variant: "destructive",
      });
      return;
    }
    setShowDialog(true);
  }, [isAuthenticated, toast]);

  return (
    <>
      <ActionButton emphasized onClick={handleAddClick}>
        <BookmarkPlus className="h-4 w-4" />
        <span className="text-xs font-semibold">Ajouter</span>
      </ActionButton>
      <AddMediaDialog
        isOpen={showDialog}
        onOpenChange={setShowDialog}
        mediaId={media.id}
        mediaType={type}
        mediaTitle={media.title || media.name}
      />
    </>
  );
}
