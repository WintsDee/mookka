
import React from "react";
import { Collection } from "@/types/collection";
import { CollectionCard } from "@/components/collections/collection-card";
import { Skeleton } from "@/components/ui/skeleton";
import { CollectionLoading } from "@/components/collections/collection-loading";

interface CollectionGridProps {
  collections: Collection[];
  loading: boolean;
  emptyMessage: string;
  className?: string;
  from?: string;
}

export const CollectionGrid = ({
  collections,
  loading,
  emptyMessage,
  className = "",
  from
}: CollectionGridProps) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className}`}>
        <CollectionLoading />
        <CollectionLoading />
        <CollectionLoading />
        <CollectionLoading />
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
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {collections.map((collection) => (
        <CollectionCard 
          key={collection.id} 
          collection={collection}
          from={from} 
        />
      ))}
    </div>
  );
};
