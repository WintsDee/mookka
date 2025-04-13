
import React from "react";
import { cn } from "@/lib/utils";
import { Book, Film, Tv, GamepadIcon } from "lucide-react";

interface MediaTypeSelectorProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

const MediaTypeSelector = ({ selectedType, onSelectType }: MediaTypeSelectorProps) => {
  const mediaTypes = [
    { id: "book", label: "Livres", icon: Book, color: "emerald" },
    { id: "film", label: "Films", icon: Film, color: "blue" },
    { id: "serie", label: "Séries", icon: Tv, color: "purple" },
    { id: "game", label: "Jeux", icon: GamepadIcon, color: "amber" },
  ];

  return (
    <div className="flex justify-center gap-3 mt-6 px-4">
      {mediaTypes.map((type) => {
        const isSelected = selectedType === type.id;
        return (
          <button
            key={type.id}
            onClick={() => onSelectType(type.id)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300",
              isSelected 
                ? `bg-${type.color}-500 text-white animate-scale-in`
                : "bg-secondary/60 text-muted-foreground"
            )}
            aria-label={type.label}
          >
            <type.icon size={24} />
            <span className="text-xs mt-2">{type.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export { MediaTypeSelector };
