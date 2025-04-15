
import React from "react";
import { MediaRating } from "@/components/media-rating";
import { MediaCollectionsSection } from "@/components/media-collections-section";
import { MediaAdditionalInfo } from "@/components/media-additional-info";
import { MediaType } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaContentProps {
  id: string;
  type: MediaType;
  formattedMedia: any;
  additionalInfo: any;
}

export function MediaContent({ id, type, formattedMedia, additionalInfo }: MediaContentProps) {
  return (
    <ScrollArea className="h-[calc(100vh-280px)]">
      <div className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="rating">Noter</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-4">
            {formattedMedia.description && (
              <div>
                <h2 className="text-lg font-medium mb-2">Synopsis</h2>
                <p className="text-sm text-muted-foreground">{formattedMedia.description}</p>
              </div>
            )}
            
            <div>
              <h2 className="text-lg font-medium mb-2">Informations</h2>
              <MediaAdditionalInfo {...additionalInfo} />
            </div>
          </TabsContent>
          
          <TabsContent value="rating" className="space-y-6 mt-4">
            {id && type && (
              <div>
                <h2 className="text-lg font-medium mb-4">Noter ce média</h2>
                <MediaRating 
                  mediaId={id} 
                  mediaType={type}
                  initialRating={0}
                />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="collections" className="space-y-6 mt-4">
            {id && (
              <div>
                <h2 className="text-lg font-medium mb-4">Gérer les collections</h2>
                <MediaCollectionsSection mediaId={id} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
