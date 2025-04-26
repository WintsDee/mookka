
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter, SortAsc, Clock, Star, Film, Tv, Book, GamepadIcon } from "lucide-react";
import { MediaType } from "@/types";

interface LibraryFiltersProps {
  sortBy: "date" | "title" | "rating";
  onSortChange: (value: "date" | "title" | "rating") => void;
  filter: MediaType | "all";
  onFilterChange: (value: MediaType | "all") => void;
}

export const LibraryFilters = ({
  sortBy,
  onSortChange,
  filter,
  onFilterChange
}: LibraryFiltersProps) => {
  const getTypeIcon = (type: MediaType | "all") => {
    switch (type) {
      case "film":
        return <Film className="h-4 w-4 flex-shrink-0" />;
      case "serie":
        return <Tv className="h-4 w-4 flex-shrink-0" />;
      case "book":
        return <Book className="h-4 w-4 flex-shrink-0" />;
      case "game":
        return <GamepadIcon className="h-4 w-4 flex-shrink-0" />;
      default:
        return <Filter className="h-4 w-4 flex-shrink-0" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {getTypeIcon(filter)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background">
        <DropdownMenuLabel>Trier par</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => onSortChange("date")}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span className={sortBy === "date" ? "font-medium" : ""}>Date d'ajout</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onSortChange("title")}
          className="flex items-center gap-2"
        >
          <SortAsc className="h-4 w-4 flex-shrink-0" />
          <span className={sortBy === "title" ? "font-medium" : ""}>Titre</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onSortChange("rating")}
          className="flex items-center gap-2"
        >
          <Star className="h-4 w-4 flex-shrink-0" />
          <span className={sortBy === "rating" ? "font-medium" : ""}>Note</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Type de média</DropdownMenuLabel>
        
        <DropdownMenuItem
          onClick={() => onFilterChange("all")}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4 flex-shrink-0" />
          <span className={filter === "all" ? "font-medium" : ""}>Tous</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onFilterChange("film")}
          className="flex items-center gap-2"
        >
          <Film className="h-4 w-4 flex-shrink-0" />
          <span className={filter === "film" ? "font-medium" : ""}>Films</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onFilterChange("serie")}
          className="flex items-center gap-2"
        >
          <Tv className="h-4 w-4 flex-shrink-0" />
          <span className={filter === "serie" ? "font-medium" : ""}>Séries</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onFilterChange("book")}
          className="flex items-center gap-2"
        >
          <Book className="h-4 w-4 flex-shrink-0" />
          <span className={filter === "book" ? "font-medium" : ""}>Livres</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onFilterChange("game")}
          className="flex items-center gap-2"
        >
          <GamepadIcon className="h-4 w-4 flex-shrink-0" />
          <span className={filter === "game" ? "font-medium" : ""}>Jeux</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
