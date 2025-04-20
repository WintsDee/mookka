
import React from "react";
import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageGridProps {
  images: string[];
  selectedImage: string | null;
  onImageSelect: (imageUrl: string) => void;
}

export function ImageGrid({ images, selectedImage, onImageSelect }: ImageGridProps) {
  return (
    <ScrollArea className="h-[300px]">
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, idx) => (
          <div 
            key={idx}
            className={`
              relative aspect-square rounded-md overflow-hidden cursor-pointer
              ${selectedImage === img ? 'ring-2 ring-primary' : ''}
            `}
            onClick={() => onImageSelect(img)}
          >
            <img 
              src={img}
              alt={`Image ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {selectedImage === img && (
              <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                <Check size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
