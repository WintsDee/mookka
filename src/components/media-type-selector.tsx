
import React from "react";
import { cn } from "@/lib/utils";
import { Book, Film, Tv, GamepadIcon } from "lucide-react";
import { MediaType } from "@/types";

interface MediaTypeSelectorProps {
  selectedType: MediaType | "";
  onSelectType: (type: string) => void;
  className?: string;
}

const MediaTypeSelector = ({ 
  selectedType, 
  onSelectType, 
  className
}: MediaTypeSelectorProps) => {
  const mediaTypes = [
    { id: "book", label: "Livres", icon: Book, color: "emerald" },
    { id: "film", label: "Films", icon: Film, color: "blue" },
    { id: "serie", label: "Séries", icon: Tv, color: "purple" },
    { id: "game", label: "Jeux", icon: GamepadIcon, color: "amber" },
  ];

  return (
    <div className={cn("flex justify-center gap-3 px-4", className)}>
      {mediaTypes.map((type) => {
        const isSelected = selectedType === type.id;
        const mediaColor = `media-${type.id}`;
        
        return (
          <button
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 shadow-sm flex-shrink-0", // Ajout de flex-shrink-0
              isSelected 
                ? `bg-${mediaColor} text-white scale-105 shadow-md`
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary/80"
            )}
            aria-label={type.label}
          >
            <type.icon size={24} className={isSelected ? "animate-pulse" : ""} />
            <span className={cn("text-xs mt-2 font-medium", isSelected && "font-bold")}>
              {type.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export { MediaTypeSelector };

