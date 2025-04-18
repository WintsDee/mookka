
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Background } from "@/components/ui/background";
import { AddToCollectionDialog } from "@/components/collections/add-to-collection-dialog";
import { useCollections } from "@/hooks/use-collections";
import { useMediaDetail } from "@/hooks/use-media-detail";
import { MediaDetailHeader } from "@/components/media-detail/media-detail-header";
import { MediaContent } from "@/components/media-detail/media-content";
import { MediaDetailActions } from "@/components/media-detail/media-detail-actions";
import { MediaDetailLoading } from "@/components/media-detail/media-detail-loading";
import { MediaDetailError } from "@/components/media-detail/media-detail-error";

const MediaDetail = () => {
  const navigate = useNavigate();
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);
  const { addMediaToCollection, isAddingToCollection } = useCollections();
  const {
    isLoading,
    hasError,
    media,
    formattedMedia,
    additionalInfo,
    previousPath,
    searchParams,
    type,
    id
  } = useMediaDetail();

  const handleGoBack = () => {
    if (previousPath) {
      // Naviguer vers la route précédente avec les paramètres de recherche si nécessaire
      if (searchParams) {
        navigate({
          pathname: previousPath,
          search: searchParams
        });
      } else {
        navigate(previousPath);
      }
    } else {
      navigate('/decouvrir');
    }
  };

  const handleAddToCollection = (collectionId: string) => {
    if (!id) return;
    
    const cleanId = id.includes('/') ? id.split('/')[0] : id;
    addMediaToCollection({ collectionId, mediaId: cleanId });
    setAddToCollectionOpen(false);
  };

  if (isLoading) {
    return <MediaDetailLoading onBackClick={handleGoBack} />;
  }

  if (hasError || !media || !formattedMedia || !type) {
    return <MediaDetailError onBackClick={handleGoBack} />;
  }

  return (
    <Background>
      <div className="relative flex flex-col h-screen pt-safe">
        <MediaDetailHeader 
          media={media} 
          formattedMedia={formattedMedia} 
          type={type}
          onAddToCollection={() => setAddToCollectionOpen(true)}
        />
        
        <div className="flex-1 overflow-hidden">
          <MediaContent 
            id={id!} 
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
        mediaId={id!}
        onAddToCollection={handleAddToCollection}
        isAddingToCollection={isAddingToCollection}
      />
    </Background>
  );
};

export default MediaDetail;
