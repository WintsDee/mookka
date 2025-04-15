
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CollectionType, CollectionVisibility } from "@/types/collection";
import { Tag, ListChecks, Heart, Lock, Globe, Users } from "lucide-react";

interface CollectionDetailHeaderProps {
  collectionId: string;
  collectionName: string;
  collectionVisibility: CollectionVisibility;
  collectionType: CollectionType;
  onBack: () => void;
}

export const CollectionDetailHeader = ({
  collectionId,
  collectionName,
  collectionVisibility,
  collectionType,
  onBack
}: CollectionDetailHeaderProps) => {
  const navigate = useNavigate();
  
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

  return (
    <>
      {/* Header avec bouton de retour */}
      <header className="px-6 py-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
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
            <DropdownMenuItem onClick={() => navigate(`/collections/edit/${collectionId}`)}>
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
        <h1 className="text-2xl font-bold">{collectionName}</h1>
        
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            {getVisibilityIcon(collectionVisibility)}
            {getVisibilityLabel(collectionVisibility)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            {getTypeIcon(collectionType)}
            {getTypeLabel(collectionType)}
          </Badge>
        </div>
      </div>
    </>
  );
};
