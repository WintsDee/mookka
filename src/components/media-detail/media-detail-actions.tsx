
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, BookmarkPlus, FolderPlus, Share, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MediaType } from "@/types";
import { addMediaToLibrary } from "@/services/media-service";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AddMediaDialog } from "./AddMediaDialog";

interface MediaDetailActionsProps {
  media: any;
  type: MediaType;
  onAddToCollection: () => void;
}

export function MediaDetailActions({ media, type, onAddToCollection }: MediaDetailActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToLibrary, setIsAddingToLibrary] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleAddToLibrary = async () => {
    if (!media) return;

    setIsAddingToLibrary(true);
    try {
      await addMediaToLibrary(media, type);
      setShowRatingDialog(true);
    } catch (error) {
      console.error("Erreur lors de l'ajout à la bibliothèque:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter ce média à votre bibliothèque",
        variant: "destructive",
      });
    } finally {
      setIsAddingToLibrary(false);
    }
  };

  return (
    <>
      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-20 flex justify-around py-2 px-2 mb-6 mx-3 rounded-xl",
        "bg-background/40 backdrop-blur-md",
        "pb-safe-area",
        "py-4",
        "border border-border/20 shadow-lg"
      )}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5 h-auto py-1.5 px-2"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-xs">J'aime</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5 h-auto py-1.5 px-2"
          onClick={handleAddToLibrary}
          disabled={isAddingToLibrary}
        >
          {isAddingToLibrary ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <BookmarkPlus className="h-4 w-4" />
          )}
          <span className="text-xs">Ajouter</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5 h-auto py-1.5 px-2"
          onClick={onAddToCollection}
        >
          <FolderPlus className="h-4 w-4" />
          <span className="text-xs">Collection</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1.5 h-auto py-1.5 px-2"
        >
          <Share className="h-4 w-4" />
          <span className="text-xs">Partager</span>
        </Button>
      </div>

      <AddMediaDialog
        isOpen={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        mediaId={media.id}
        mediaType={type}
        mediaTitle={media.title}
      />
    </>
  );
}
