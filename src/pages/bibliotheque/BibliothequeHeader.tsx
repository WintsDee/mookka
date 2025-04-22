
import React from "react";
import { LibrarySearch } from "@/components/library/library-search";
import { LibraryFilters } from "@/components/library/library-filters";
import { LibraryTypeTabs } from "@/components/library/library-type-tabs";

interface BibliothequeHeaderProps {
  searchTerm: string;
  setSearchTerm: (newTerm: string) => void;
  onSearch: () => void;
  sortBy: "date" | "title" | "rating";
  setSortBy: (val: "date" | "title" | "rating") => void;
  mediaType: string;
  setMediaType: (val: string) => void;
}

export function BibliothequeHeader({
  searchTerm,
  setSearchTerm,
  onSearch,
  sortBy,
  setSortBy,
  mediaType,
  setMediaType,
}: BibliothequeHeaderProps) {
  return (
    <header className="fixed top-16 left-0 right-0 bg-background/95 backdrop-blur-sm z-40 px-6 pt-4 pb-2">
      <div className="flex items-center gap-4">
        <LibrarySearch
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={onSearch}
        />
        <LibraryFilters
          sortBy={sortBy}
          onSortChange={setSortBy}
          filter={mediaType as any}
          onFilterChange={setMediaType as any}
        />
      </div>
      <div className="mt-4">
        <LibraryTypeTabs 
          selectedType={mediaType as any} 
          onChange={setMediaType as any} 
        />
      </div>
    </header>
  );
}
