
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Clock, SortAsc, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LibrarySortSelectorProps {
  sortBy: 'date' | 'title' | 'rating';
  onSortChange: (value: 'date' | 'title' | 'rating') => void;
  className?: string;
}

export function LibrarySortSelector({
  sortBy,
  onSortChange,
  className
}: LibrarySortSelectorProps) {
  const sortOptions = [
    { id: 'date', label: 'Date', icon: Clock },
    { id: 'title', label: 'Titre', icon: SortAsc },
    { id: 'rating', label: 'Note', icon: Star }
  ];

  return (
    <ToggleGroup
      type="single"
      value={sortBy}
      onValueChange={(value) => {
        if (value) onSortChange(value as 'date' | 'title' | 'rating');
      }}
      className={cn("flex justify-between w-full", className)}
    >
      {sortOptions.map((option) => (
        <ToggleGroupItem 
          key={option.id} 
          value={option.id} 
          className="flex-1 text-center text-xs flex flex-col items-center gap-1"
        >
          <option.icon size={14} />
          <span>{option.label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
