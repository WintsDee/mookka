
import React, { useState, useCallback } from "react";
import { Heart, Share, FolderPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MediaType } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { MediaBar } from "./MediaBar";
import { ActionButton } from "./ActionButton";
import { AddMediaDialogTrigger } from "./AddMediaDialogTrigger";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";

/**
 * Renders media detail action bar with share, like, (add/add-to-collection) logic.
 */
interface MediaDetailActionsProps {
  media: any;
  type: MediaType;
  onAddToCollection: () => void;
}

export function MediaDetailActions({ media, type, onAddToCollection }: MediaDetailActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useProfile();

  React.useEffect(() => {
    const checkLibraryStatus = async () => {
      if (!isAuthenticated || !media?.id) return;
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data } = await supabase
        .from('user_media')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('media_id', media.id)
        .maybeSingle();

      setIsInLibrary(!!data);
    };
    checkLibraryStatus();
  }, [media?.id, isAuthenticated]);

  const handleLike = useCallback(() => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour effectuer cette action",
        variant: "destructive",
      });
      return;
    }
    setIsLiked((prev) => !prev);
  }, [isAuthenticated, toast]);

  const handleShare = useCallback(() => {
    if (!isAuthenticated) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour effectuer cette action",
        variant: "destructive",
      });
      return;
    }
    if (navigator.share) {
      navigator.share({
        title: media.title,
        text: `Découvrez ${media.title} sur Mookka !`,
        url: window.location.href,
      }).catch(() => {
        toast({
          title: "Partage",
          description: "URL copiée dans le presse-papier",
        });
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      toast({
        title: "Partage",
        description: "URL copiée dans le presse-papier",
      });
      navigator.clipboard.writeText(window.location.href);
    }
  }, [media.title, toast, isAuthenticated]);

  return (
    <MediaBar>
      <div className="flex items-center gap-2 flex-1">
        <ActionButton
          className="justify-center"
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-xs">J'aime</span>
        </ActionButton>
        <ActionButton
          className="justify-center"
          onClick={handleShare}
        >
          <Share className="h-4 w-4" />
          <span className="text-xs">Partager</span>
        </ActionButton>
      </div>
      <div className="flex items-center gap-2">
        {isInLibrary ? (
          <ActionButton
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={onAddToCollection}
          >
            <FolderPlus className="h-4 w-4" />
            <span className="text-xs">Collection</span>
          </ActionButton>
        ) : (
          <AddMediaDialogTrigger media={media} type={type} />
        )}
      </div>
    </MediaBar>
  );
}
