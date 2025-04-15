
import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { useToast } from "@/components/ui/use-toast";
import { getCollectionById, followCollection, unfollowCollection } from "@/services/collection-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CollectionDetailHeader } from "@/components/collections/collection-detail-header";
import { CollectionDetailActions } from "@/components/collections/collection-detail-actions";
import { CollectionMediaGrid } from "@/components/collections/collection-media-grid";
import { CollectionLoading } from "@/components/collections/collection-loading";
import { CollectionType, CollectionVisibility, CollectionItem } from "@/types/collection";

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Récupérer les détails de la collection
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => getCollectionById(id!),
    enabled: !!id
  });
  
  // Mutation pour suivre une collection
  const followMutation = useMutation({
    mutationFn: (collectionId: string) => followCollection(collectionId),
    onSuccess: () => {
      setIsFollowing(true);
      queryClient.invalidateQueries({ queryKey: ['collections', 'followed'] });
      toast({
        title: "Collection suivie",
        description: "Vous suivez maintenant cette collection"
      });
    },
    onError: (error) => {
      console.error("Erreur lors du suivi de la collection:", error);
      toast({
        title: "Erreur",
        description: "Impossible de suivre cette collection",
        variant: "destructive"
      });
    }
  });
  
  // Mutation pour ne plus suivre une collection
  const unfollowMutation = useMutation({
    mutationFn: (collectionId: string) => unfollowCollection(collectionId),
    onSuccess: () => {
      setIsFollowing(false);
      queryClient.invalidateQueries({ queryKey: ['collections', 'followed'] });
      toast({
        title: "Collection non suivie",
        description: "Vous ne suivez plus cette collection"
      });
    },
    onError: (error) => {
      console.error("Erreur lors de l'arrêt du suivi de la collection:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'arrêter de suivre cette collection",
        variant: "destructive"
      });
    }
  });
  
  // Gérer le clic sur le bouton de suivi
  const handleToggleFollow = () => {
    if (!id) return;
    
    if (isFollowing) {
      unfollowMutation.mutate(id);
    } else {
      followMutation.mutate(id);
    }
  };
  
  // Gérer le clic sur le bouton de retour
  const handleGoBack = () => {
    // Check if there's state from react-router indicating where we came from
    if (location.state?.from) {
      navigate(location.state.from, { replace: true });
    } else {
      // Default fallback
      navigate(-1);
    }
  };
  
  if (isLoading) {
    return (
      <Background>
        <MobileHeader />
        <CollectionLoading />
        <MobileNav />
      </Background>
    );
  }
  
  if (error || !data) {
    return (
      <Background>
        <MobileHeader />
        <CollectionLoading isError onBack={handleGoBack} />
        <MobileNav />
      </Background>
    );
  }
  
  const { collection, items } = data;
  
  // Convert items to match CollectionItem type
  const typedItems: CollectionItem[] = items.map(item => ({
    ...item,
    media: {
      ...item.media,
      status: item.media.status as "to-watch" | "watching" | "completed"
    }
  }));

  return (
    <Background>
      <MobileHeader />
      <div className="pb-24 pt-safe mt-16">
        <CollectionDetailHeader 
          collectionId={collection.id}
          collectionName={collection.name}
          collectionVisibility={collection.visibility as CollectionVisibility}
          collectionType={collection.type as CollectionType}
          onBack={handleGoBack}
        />
        
        <CollectionDetailActions 
          isFollowing={isFollowing}
          description={collection.description}
          onToggleFollow={handleToggleFollow}
          isPending={followMutation.isPending || unfollowMutation.isPending}
        />
        
        <CollectionMediaGrid 
          items={typedItems}
          collectionType={collection.type as CollectionType}
          fromPath={location.pathname}
        />
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default CollectionDetail;
