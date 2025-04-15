
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { CollectionVisibility } from '@/types/collection';
import { Lock, Globe, Users } from 'lucide-react';

interface CollectionVisibilitySelectorProps {
  selectedVisibility: CollectionVisibility | 'all';
  onSelectVisibility: (visibility: CollectionVisibility | 'all') => void;
}

export function CollectionVisibilitySelector({
  selectedVisibility,
  onSelectVisibility
}: CollectionVisibilitySelectorProps) {
  return (
    <ToggleGroup
      type="single"
      value={selectedVisibility}
      onValueChange={(value) => {
        if (value) onSelectVisibility(value as CollectionVisibility | 'all');
      }}
      className="flex justify-between w-full"
    >
      <ToggleGroupItem value="all" className="flex-1 text-center text-xs">
        Toutes
      </ToggleGroupItem>
      <ToggleGroupItem value="private" className="flex-1 text-center text-xs flex flex-col items-center gap-1">
        <Lock size={14} />
        Privées
      </ToggleGroupItem>
      <ToggleGroupItem value="public" className="flex-1 text-center text-xs flex flex-col items-center gap-1">
        <Globe size={14} />
        Publiques
      </ToggleGroupItem>
      <ToggleGroupItem value="collaborative" className="flex-1 text-center text-xs flex flex-col items-center gap-1">
        <Users size={14} />
        Collaboratives
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
