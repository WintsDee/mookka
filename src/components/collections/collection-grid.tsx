
import React from "react";
import { Collection } from "@/types/collection";
import { CollectionCard } from "@/components/collections/collection-card";
import { CollectionLoading } from "@/components/collections/collection-loading";

interface CollectionGridProps {
  collections: Collection[];
  loading: boolean;
  emptyMessage: string;
  className?: string;
  from?: string;
  columns?: number;
  cardSize?: 'small' | 'medium' | 'large';
}

export const CollectionGrid = ({
  collections,
  loading,
  emptyMessage,
  className = "",
  from,
  columns = 2,
  cardSize = "medium"
}: CollectionGridProps) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-${columns} gap-4 ${className}`}>
        <CollectionLoading />
        <CollectionLoading />
        {columns > 2 && (
          <>
            <CollectionLoading />
            <CollectionLoading />
          </>
        )}
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-${columns} gap-4 ${className}`}>
      {collections.map((collection) => (
        <CollectionCard 
          key={collection.id} 
          collection={collection}
          from={from} 
          size={cardSize}
        />
      ))}
    </div>
  );
};
