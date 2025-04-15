
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CollectionType } from '@/types/collection';
import { Tag, ListChecks, Heart } from 'lucide-react';

interface CollectionTypeSelectorProps {
  selectedType: CollectionType | 'all';
  onSelectType: (type: CollectionType | 'all') => void;
}

export function CollectionTypeSelector({
  selectedType,
  onSelectType
}: CollectionTypeSelectorProps) {
  return (
    <ToggleGroup
      type="single"
      value={selectedType}
      onValueChange={(value) => {
        if (value) onSelectType(value as CollectionType | 'all');
      }}
      className="flex justify-between w-full"
    >
      <ToggleGroupItem value="all" className="flex-1 text-center text-xs">
        Toutes
      </ToggleGroupItem>
      <ToggleGroupItem value="thematic" className="flex-1 text-center text-xs flex flex-col items-center gap-1">
        <Tag size={14} />
        Thématiques
      </ToggleGroupItem>
      <ToggleGroupItem value="ranking" className="flex-1 text-center text-xs flex flex-col items-center gap-1">
        <ListChecks size={14} />
        Classements
      </ToggleGroupItem>
      <ToggleGroupItem value="selection" className="flex-1 text-center text-xs flex flex-col items-center gap-1">
        <Heart size={14} />
        Sélections
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
