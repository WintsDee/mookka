
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollectionGrid } from "@/components/collections/collection-grid";
import { MediaCard } from "@/components/media-card";
import { Collection } from "@/types/collection";
import { Media } from "@/types";
import { BookOpen, Film, Bookmark, MessageSquare } from "lucide-react";

interface ProfileTabsProps {
  collections: Collection[];
  loadingCollections: boolean;
  favoriteMedia: Media[];
}

export function ProfileTabs({ collections, loadingCollections, favoriteMedia }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="collections" className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        <TabsTrigger value="collections" className="flex gap-1 items-center justify-center">
          <Bookmark size={14} />
          <span>Collections</span>
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex gap-1 items-center justify-center">
          <MessageSquare size={14} />
          <span>Critiques</span>
        </TabsTrigger>
        <TabsTrigger value="favorites" className="flex gap-1 items-center justify-center">
          <BookOpen size={14} />
          <span>Favoris</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="collections" className="mt-4">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Bookmark size={18} className="text-primary" />
          Mes collections
        </h3>
        <ScrollArea className="h-[calc(100vh-380px)] overflow-y-auto">
          <div className="pb-6">
            <CollectionGrid
              collections={collections}
              loading={loadingCollections}
              emptyMessage="Vous n'avez pas encore créé de collection."
              columns={2}
              cardSize="small"
            />
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="reviews">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <MessageSquare size={18} className="text-primary" />
          Mes critiques
        </h3>
        <ScrollArea className="h-[calc(100vh-380px)] overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-40 text-center px-6 pb-6">
            <p className="text-muted-foreground">
              Vos critiques apparaîtront ici.
            </p>
          </div>
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="favorites">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-primary" />
          Récemment ajoutés
        </h3>
        <ScrollArea className="h-[calc(100vh-380px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 pb-6">
            {favoriteMedia.map((media) => (
              <MediaCard key={media.id} media={media} size="small" />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
