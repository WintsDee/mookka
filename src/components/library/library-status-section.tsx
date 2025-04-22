
import React from "react";
import { MediaCard } from "@/components/media-card";
import { Media, MediaStatus } from "@/types";
import { Eye, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LibraryStatusSectionProps {
  title: string;
  icon: React.ElementType;
  media: Media[];
  emptyMessage: string;
}

export function LibraryStatusSection({ title, icon: Icon, media, emptyMessage }: LibraryStatusSectionProps) {
  const navigate = useNavigate();
  
  if (media.length === 0) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Icon className="mr-2 h-5 w-5" />
          {title}
        </h2>
        <div className="flex flex-col items-center justify-center py-8 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground mb-4">{emptyMessage}</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/recherche')}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un média
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Icon className="mr-2 h-5 w-5" />
        {title}
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({media.length})
        </span>
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {media.map((item) => (
          <MediaCard key={item.id} media={item} />
        ))}
      </div>
    </div>
  );
}
