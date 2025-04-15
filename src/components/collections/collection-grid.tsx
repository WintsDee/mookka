
import React from "react";
import { Link } from "react-router-dom";
import { Collection } from "@/types/collection";
import { CollectionCard } from "./collection-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Folder, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollectionGridProps {
  collections: Collection[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onCreateNew?: () => void;
  from?: string;
  columns?: number;
  cardSize?: string;
}

export const CollectionGrid = ({
  collections = [],
  loading = false,
  emptyMessage = "Aucune collection trouvée.",
  className = "",
  onCreateNew,
  from,
  columns = 2,
  cardSize = "default"
}: CollectionGridProps) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-${columns} gap-4 sm:grid-cols-3 md:grid-cols-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-full h-32 rounded-lg" />
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-3" />
          </div>
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
        <Folder className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center mb-4">{emptyMessage}</p>
        {onCreateNew && (
          <Button onClick={onCreateNew} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Créer une collection
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-${columns} gap-4 sm:grid-cols-3 md:grid-cols-4 ${className}`}>
      {collections.map((collection) => (
        <Link 
          key={collection.id} 
          to={`/collections/${collection.id}`}
          state={from ? { from } : undefined}
        >
          <CollectionCard collection={collection} size={cardSize} />
        </Link>
      ))}
    </div>
  );
};
