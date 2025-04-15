
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Loader2 } from "lucide-react";

interface CollectionDetailActionsProps {
  isFollowing: boolean;
  description?: string;
  onToggleFollow: () => void;
  isPending: boolean;
}

export const CollectionDetailActions = ({
  isFollowing,
  description,
  onToggleFollow,
  isPending
}: CollectionDetailActionsProps) => {
  return (
    <div className="px-6">
      {description && (
        <p className="mt-4 text-muted-foreground text-sm">
          {description}
        </p>
      )}
      
      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          variant={isFollowing ? "default" : "outline"}
          className="flex-1"
          onClick={onToggleFollow}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Heart className={`h-4 w-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
          )}
          {isFollowing ? 'Suivi' : 'Suivre'}
        </Button>
        
        <Button 
          size="sm" 
          variant="outline"
          className="flex-1"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </div>
    </div>
  );
};
