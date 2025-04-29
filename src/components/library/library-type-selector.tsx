
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MediaType } from '@/types';
import { Film, Tv, Book, GamepadIcon, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LibraryTypeSelectorProps {
  selectedType: MediaType | 'all';
  onSelectType: (type: MediaType | 'all') => void;
  className?: string;
}

export function LibraryTypeSelector({
  selectedType,
  onSelectType,
  className
}: LibraryTypeSelectorProps) {
  const mediaTypes = [
    { id: 'all', label: 'Tous', icon: LayoutGrid },
    { id: 'film', label: 'Films', icon: Film },
    { id: 'serie', label: 'Séries', icon: Tv },
    { id: 'book', label: 'Livres', icon: Book },
    { id: 'game', label: 'Jeux', icon: GamepadIcon }
  ];

  return (
    <ToggleGroup
      type="single"
      value={selectedType}
      onValueChange={(value) => {
        if (value) onSelectType(value as MediaType | 'all');
      }}
      className={cn("flex justify-between w-full", className)}
    >
      {mediaTypes.map((type) => (
        <ToggleGroupItem 
          key={type.id} 
          value={type.id} 
          className="flex-1 text-center text-xs flex flex-col items-center gap-1"
        >
          {type.icon && <type.icon size={14} />}
          <span>{type.label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
