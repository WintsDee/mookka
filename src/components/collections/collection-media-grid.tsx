
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MediaCard } from "@/components/media-card";
import { CollectionItem } from "@/types/collection";

interface CollectionMediaGridProps {
  items: CollectionItem[];
  collectionType: 'thematic' | 'ranking' | 'selection';
  fromPath: string;
}

export const CollectionMediaGrid = ({
  items,
  collectionType,
  fromPath
}: CollectionMediaGridProps) => {
  return (
    <div className="mt-6">
      <div className="px-6 mb-4">
        <h2 className="text-lg font-medium">
          {collectionType === 'ranking' ? 'Classement' : 'Médias'} ({items.length})
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
                showDetails={true}
                from={fromPath}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
