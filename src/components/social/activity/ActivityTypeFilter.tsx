
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface ActivityTypeFilterProps {
  onFilterChange: (types: string[]) => void;
  activeFilters: string[];
}

export function ActivityTypeFilter({ onFilterChange, activeFilters }: ActivityTypeFilterProps) {
  const activityTypes = [
    { id: 'added', label: 'Ajouts' },
    { id: 'rated', label: 'Notes' },
    { id: 'watching', label: 'En cours' },
    { id: 'completed', label: 'Terminés' },
    { id: 'collection', label: 'Collections' }
  ];

  const toggleFilter = (typeId: string) => {
    let newFilters;
    
    if (activeFilters.includes(typeId)) {
      newFilters = activeFilters.filter(id => id !== typeId);
    } else {
      newFilters = [...activeFilters, typeId];
    }
    
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center mr-1 text-xs text-muted-foreground">
        <Filter className="h-3 w-3 mr-1" />
        <span>Filtrer:</span>
      </div>
      
      {activityTypes.map(type => (
        <Badge
          key={type.id}
          variant={activeFilters.includes(type.id) ? "default" : "outline"}
          className={`cursor-pointer hover:bg-secondary/80 ${activeFilters.includes(type.id) ? '' : 'text-muted-foreground'}`}
          onClick={() => toggleFilter(type.id)}
        >
          {type.label}
        </Badge>
      ))}
    </div>
  );
}
