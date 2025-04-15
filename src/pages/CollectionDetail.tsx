
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Background } from "@/components/ui/background";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { Button } from "@/components/ui/button";
import { MediaCard } from "@/components/media-card";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Heart,
  Share2,
  MoreVertical,
  Tag,
  ListChecks,
  Lock,
  Globe,
  Users,
  Loader2
} from "lucide-react";
import { getCollectionById, followCollection, unfollowCollection } from "@/services/collection-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CollectionType, CollectionVisibility } from "@/types/collection";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
  
  // Icône en fonction du type de collection
  const getTypeIcon = (type: CollectionType) => {
    switch (type) {
      case 'thematic':
        return <Tag size={14} />;
      case 'ranking':
        return <ListChecks size={14} />;
      case 'selection':
        return <Heart size={14} />;
    }
  };
  
  // Icône en fonction de la visibilité de la collection
  const getVisibilityIcon = (visibility: CollectionVisibility) => {
    switch (visibility) {
      case 'private':
        return <Lock size={14} />;
      case 'public':
        return <Globe size={14} />;
      case 'collaborative':
        return <Users size={14} />;
    }
  };
  
  // Label en fonction de la visibilité de la collection
  const getVisibilityLabel = (visibility: CollectionVisibility) => {
    switch (visibility) {
      case 'private':
        return 'Privée';
      case 'public':
        return 'Publique';
      case 'collaborative':
        return 'Collaborative';
    }
  };
  
  // Label en fonction du type de collection
  const getTypeLabel = (type: CollectionType) => {
    switch (type) {
      case 'thematic':
        return 'Thématique';
      case 'ranking':
        return 'Classement';
      case 'selection':
        return 'Sélection';
    }
  };
  
  if (isLoading) {
    return (
      <Background>
        <MobileHeader />
        <div className="flex flex-col items-center justify-center h-screen">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="mt-4 text-lg">Chargement en cours...</p>
        </div>
      </Background>
    );
  }
  
  if (error || !data) {
    return (
      <Background>
        <MobileHeader />
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-lg text-destructive">Une erreur est survenue lors du chargement de la collection.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Retour
          </Button>
        </div>
      </Background>
    );
  }
  
  const { collection, items } = data;

  return (
    <Background>
      <MobileHeader />
      <div className="pb-24 pt-safe mt-16">
        {/* Header avec bouton de retour */}
        <header className="px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/collections/edit/${collection.id}`)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        
        {/* Informations de la collection */}
        <div className="px-6">
          <h1 className="text-2xl font-bold">{collection.name}</h1>
          
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              {getVisibilityIcon(collection.visibility)}
              {getVisibilityLabel(collection.visibility)}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {getTypeIcon(collection.type)}
              {getTypeLabel(collection.type)}
            </Badge>
          </div>
          
          {collection.description && (
            <p className="mt-4 text-muted-foreground text-sm">
              {collection.description}
            </p>
          )}
          
          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant={isFollowing ? "default" : "outline"}
              className="flex-1"
              onClick={handleToggleFollow}
              disabled={followMutation.isPending || unfollowMutation.isPending}
            >
              {followMutation.isPending || unfollowMutation.isPending ? (
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
        
        {/* Liste des médias */}
        <div className="mt-6">
          <div className="px-6 mb-4">
            <h2 className="text-lg font-medium">
              {collection.type === 'ranking' ? 'Classement' : 'Médias'} ({items.length})
            </h2>
          </div>
          
          <ScrollArea className="h-[calc(100vh-360px)]">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center px-6">
                <p className="text-muted-foreground">
                  Cette collection ne contient aucun média pour le moment.
                </p>
              </div>
            ) : (
              <div className="px-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {items.map((item) => (
                  <MediaCard 
                    key={item.id} 
                    media={item.media!}
                    size="small"
                  />
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
      
      <MobileNav />
    </Background>
  );
};

export default CollectionDetail;
