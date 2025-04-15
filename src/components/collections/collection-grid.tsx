
import React from 'react';
import { Collection } from '@/types/collection';
import { CollectionCard } from './collection-card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CollectionGridProps {
  collections: Collection[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  cardSize?: 'small' | 'medium' | 'large';
  columns?: 1 | 2 | 3 | 4;
}

export function CollectionGrid({
  collections,
  loading = false,
  emptyMessage = "Aucune collection trouvée",
  className,
  cardSize = 'medium',
  columns = 2
}: CollectionGridProps) {
  // Définir le nombre de colonnes
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  }[columns];

  if (loading) {
    return (
      <div className={cn(`grid ${gridCols} gap-4`, className)}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn(`grid ${gridCols} gap-4`, className)}>
      {collections.map(collection => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          size={cardSize}
        />
      ))}
    </div>
  );
}
