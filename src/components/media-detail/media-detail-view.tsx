
import React, { useState } from "react";
import { MediaType } from "@/types";
import { Background } from "@/components/ui/background";
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog";
import { useCollections } from "@/hooks/use-collections";
import { MediaDetailHeader } from "@/components/media-detail/media-detail-header";
import { MediaContent } from "@/components/media-detail/media-content";
import { MediaDetailActions } from "@/components/media-detail/media-detail-actions";

interface MediaDetailViewProps {
  id: string;
  type: MediaType;
  media: any;
  formattedMedia: any;
  additionalInfo: any;
}

export function MediaDetailView({ id, type, media, formattedMedia, additionalInfo }: MediaDetailViewProps) {
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const { addMediaToCollection, isAddingToCollection } = useCollections();

  const handleAddToCollection = (collectionId: string) => {
    if (!id) return;
    
    addMediaToCollection({ collectionId, mediaId: id });
    setAddToCollectionOpen(false);
  };

  return (
    <Background>
      <div className="relative flex flex-col h-screen pt-safe animate-fade-in">
        <MediaDetailHeader 
          media={media} 
          formattedMedia={formattedMedia} 
          type={type}
          onAddToCollection={() => setAddToCollectionOpen(true)}
        />
        
        <div className="flex-1 overflow-hidden">
          <MediaContent 
            id={id} 
            type={type} 
            formattedMedia={formattedMedia} 
            additionalInfo={additionalInfo} 
          />
        </div>
        
        <MediaDetailActions 
          media={media} 
          type={type} 
          onAddToCollection={() => setAddToCollectionOpen(true)} 
        />
      </div>
      
      <AddToCollectionDialog
        open={addToCollectionOpen}
        onOpenChange={setAddToCollectionOpen}
        mediaId={id}
        onAddToCollection={handleAddToCollection}
        isAddingToCollection={isAddingToCollection}
      />
    </Background>
  );
}
