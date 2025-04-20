
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageGrid } from "./image-grid";

interface SearchTabProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  searchResults: string[];
  selectedImage: string | null;
  onImageSelect: (imageUrl: string) => void;
}

export function SearchTab({
  searchQuery,
  onSearchChange,
  onSearch,
  searchResults,
  selectedImage,
  onImageSelect,
}: SearchTabProps) {
  return (
    <div className="mt-4">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Rechercher une image..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button onClick={onSearch}>
          <Search size={16} />
        </Button>
      </div>
      
      <ImageGrid
        images={searchResults}
        selectedImage={selectedImage}
        onImageSelect={onImageSelect}
      />
    </div>
  );
}
