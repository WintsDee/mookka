
import React from "react";
import { MediaType, MediaStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "lucide-react";

interface LibraryFiltersProps {
  selectedTypes: MediaType[];
  selectedStatuses: MediaStatus[];
  yearRange: [number, number];
  onTypeChange: (types: MediaType[]) => void;
  onStatusChange: (statuses: MediaStatus[]) => void;
  onYearChange: (range: [number, number]) => void;
}

export function LibraryFilters({
  selectedTypes,
  selectedStatuses,
  yearRange,
  onTypeChange,
  onStatusChange,
  onYearChange,
}: LibraryFiltersProps) {
  const mediaTypes: { value: MediaType; label: string }[] = [
    { value: "film", label: "Films" },
    { value: "serie", label: "Séries" },
    { value: "book", label: "Livres" },
    { value: "game", label: "Jeux" },
  ];

  const statusTypes: { value: MediaStatus; label: string }[] = [
    { value: "to-watch", label: "À voir" },
    { value: "watching", label: "En cours" },
    { value: "completed", label: "Terminé" },
    { value: "to-read", label: "À lire" },
    { value: "reading", label: "En lecture" },
    { value: "to-play", label: "À jouer" },
    { value: "playing", label: "En cours de jeu" },
  ];

  const handleTypeToggle = (type: MediaType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    onTypeChange(newTypes);
  };

  const handleStatusToggle = (status: MediaStatus) => {
    const newStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];
    onStatusChange(newStatuses);
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FilterIcon className="h-4 w-4" />
            Filtres
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Types de médias</DropdownMenuLabel>
          {mediaTypes.map((type) => (
            <DropdownMenuCheckboxItem
              key={type.value}
              checked={selectedTypes.includes(type.value)}
              onCheckedChange={() => handleTypeToggle(type.value)}
            >
              {type.label}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Statut</DropdownMenuLabel>
          {statusTypes.map((status) => (
            <DropdownMenuCheckboxItem
              key={status.value}
              checked={selectedStatuses.includes(status.value)}
              onCheckedChange={() => handleStatusToggle(status.value)}
            >
              {status.label}
            </DropdownMenuCheckboxItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel>Année</DropdownMenuLabel>
          <div className="px-4 py-2">
            <Slider
              min={1900}
              max={new Date().getFullYear()}
              step={1}
              value={[yearRange[0], yearRange[1]]}
              onValueChange={(value) => onYearChange(value as [number, number])}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{yearRange[0]}</span>
              <span>{yearRange[1]}</span>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
