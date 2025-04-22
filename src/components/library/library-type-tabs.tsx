
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Tv, Book, GamepadIcon } from "lucide-react";
import { MediaType } from "@/types";

interface LibraryTypeTabsProps {
  selectedType: MediaType | "all";
  onChange: (type: MediaType | "all") => void;
}

export function LibraryTypeTabs({ selectedType, onChange }: LibraryTypeTabsProps) {
  return (
    <Tabs 
      value={selectedType} 
      onValueChange={(value) => onChange(value as MediaType | "all")}
      className="w-full"
    >
      <TabsList className="w-full grid grid-cols-5">
        <TabsTrigger 
          value="all" 
          className="flex items-center gap-2"
        >
          <span className="hidden sm:inline">Tous</span>
        </TabsTrigger>
        <TabsTrigger 
          value="book" 
          className="flex items-center gap-2"
        >
          <Book className="h-4 w-4" />
          <span className="hidden sm:inline">Livres</span>
        </TabsTrigger>
        <TabsTrigger 
          value="film" 
          className="flex items-center gap-2"
        >
          <Film className="h-4 w-4" />
          <span className="hidden sm:inline">Films</span>
        </TabsTrigger>
        <TabsTrigger 
          value="serie" 
          className="flex items-center gap-2"
        >
          <Tv className="h-4 w-4" />
          <span className="hidden sm:inline">Séries</span>
        </TabsTrigger>
        <TabsTrigger 
          value="game" 
          className="flex items-center gap-2"
        >
          <GamepadIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Jeux</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
