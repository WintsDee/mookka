
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = "added" | "title" | "year" | "rating";

interface LibrarySortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function LibrarySort({ value, onChange }: LibrarySortProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Trier par..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="added">Date d'ajout</SelectItem>
        <SelectItem value="title">Titre</SelectItem>
        <SelectItem value="year">Année</SelectItem>
        <SelectItem value="rating">Note</SelectItem>
      </SelectContent>
    </Select>
  );
}
