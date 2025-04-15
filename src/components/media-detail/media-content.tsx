
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaType } from "@/types";
import { TabContent } from "./tabs/tab-content";

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
          
          <TabContent
            id={id}
            type={type}
            formattedMedia={formattedMedia}
            additionalInfo={additionalInfo}
          />
        </Tabs>
      </div>
    </ScrollArea>
  );
}
