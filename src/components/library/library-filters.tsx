
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
import { Filter, SortAsc, Clock, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface LibraryFiltersProps {
  sortBy: "date" | "title" | "rating";
  onSortChange: (value: "date" | "title" | "rating") => void;
  showCompleted: boolean;
  onShowCompletedChange: (value: boolean) => void;
}

export const LibraryFilters = ({
  sortBy,
  onSortChange,
  showCompleted,
  onShowCompletedChange,
}: LibraryFiltersProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Trier par</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => onSortChange("date")}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          <span className={sortBy === "date" ? "font-medium" : ""}>Date d'ajout</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onSortChange("title")}
          className="flex items-center gap-2"
        >
          <SortAsc className="h-4 w-4" />
          <span className={sortBy === "title" ? "font-medium" : ""}>Titre</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onSortChange("rating")}
          className="flex items-center gap-2"
        >
          <Star className="h-4 w-4" />
          <span className={sortBy === "rating" ? "font-medium" : ""}>Note</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Filtres</DropdownMenuLabel>
        
        <div className="p-2">
          <div className="flex items-center justify-between">
            <label htmlFor="show-completed" className="text-sm">
              Afficher les médias terminés
            </label>
            <Switch
              id="show-completed"
              checked={showCompleted}
              onCheckedChange={onShowCompletedChange}
            />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
