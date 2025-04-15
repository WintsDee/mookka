
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collection } from '@/types/collection';
import { Users, Lock, Globe, Heart, ListChecks, Tag } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
  size?: 'small' | 'medium' | 'large';
}

export function CollectionCard({ collection, size = 'medium' }: CollectionCardProps) {
  // Configuration des tailles
  const sizes = {
    small: {
      card: 'w-full max-w-[160px]',
      image: 'h-36',
      title: 'text-sm font-medium',
      badges: 'hidden'
    },
    medium: {
      card: 'w-full',
      image: 'h-44',
      title: 'text-lg font-semibold',
      badges: 'flex'
    },
    large: {
      card: 'w-full',
      image: 'h-52',
      title: 'text-xl font-bold',
      badges: 'flex'
    }
  };
  
  // Icône en fonction du type de collection
  const TypeIcon = {
    'thematic': Tag,
    'ranking': ListChecks,
    'selection': Heart
  }[collection.type];
  
  // Icône en fonction de la visibilité de la collection
  const VisibilityIcon = {
    'private': Lock,
    'public': Globe,
    'collaborative': Users
  }[collection.visibility];
  
  // Label en fonction de la visibilité de la collection
  const visibilityLabel = {
    'private': 'Privée',
    'public': 'Publique',
    'collaborative': 'Collaborative'
  }[collection.visibility];
  
  // Label en fonction du type de collection
  const typeLabel = {
    'thematic': 'Thématique',
    'ranking': 'Classement',
    'selection': 'Sélection'
  }[collection.type];

  return (
    <Link to={`/collections/${collection.id}`}>
      <Card className={`overflow-hidden transition duration-300 hover:shadow-md ${sizes[size].card}`}>
        <div 
          className={`${sizes[size].image} bg-gradient-to-br from-primary/20 to-secondary/20 relative`}
          style={collection.coverImage ? { 
            backgroundImage: `url(${collection.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          
          {/* Bottom badges */}
          <div className={`absolute bottom-2 left-2 flex gap-1.5 ${sizes[size].badges}`}>
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <VisibilityIcon size={12} />
              {visibilityLabel}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <TypeIcon size={12} />
              {typeLabel}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="p-3 pb-1">
          <h3 className={sizes[size].title}>{collection.name}</h3>
        </CardHeader>
        
        {size !== 'small' && collection.description && (
          <CardContent className="p-3 pt-0">
            <CardDescription className="line-clamp-2 text-xs">
              {collection.description}
            </CardDescription>
          </CardContent>
        )}
        
        <CardFooter className="p-3 pt-0 flex justify-between">
          <span className="text-xs text-muted-foreground">
            {collection.itemCount || 0} éléments
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
