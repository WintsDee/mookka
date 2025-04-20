
import React from "react";
import { ImageGrid } from "./image-grid";

interface GalleryTabProps {
  images: string[];
  selectedImage: string | null;
  onImageSelect: (imageUrl: string) => void;
}

export function GalleryTab({ images, selectedImage, onImageSelect }: GalleryTabProps) {
  return (
    <div className="mt-4">
      <ImageGrid
        images={images}
        selectedImage={selectedImage}
        onImageSelect={onImageSelect}
      />
    </div>
  );
}
