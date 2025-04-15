
import React from "react";
import { Check, ChevronDown, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface NewsSourceSelectorProps {
  sources: string[];
  activeSource: string | null;
  activeSources: string[];
  onSourceChange: (source: string | null) => void;
  onSourcesChange: (sources: string[]) => void;
}

export const NewsSourceSelector: React.FC<NewsSourceSelectorProps> = ({
  sources,
  activeSource,
  activeSources,
  onSourceChange,
  onSourcesChange,
}) => {
  const handleSingleSourceSelect = (source: string | null) => {
    onSourceChange(source);
    onSourcesChange(source ? [source] : []);
  };

  const handleMultiSourceSelect = (source: string) => {
    const newSources = [...activeSources];
    
    if (newSources.includes(source)) {
      // Remove source if already selected
      const index = newSources.indexOf(source);
      newSources.splice(index, 1);
    } else {
      // Add source if not already selected
      newSources.push(source);
    }
    
    onSourceChange(null);
    onSourcesChange(newSources);
  };

  const clearAllSources = () => {
    onSourceChange(null);
    onSourcesChange([]);
  };

  return (
    <div className="flex flex-col">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            {activeSource ? (
              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-primary" />
                <span className="max-w-[100px] truncate">{activeSource}</span>
              </div>
            ) : activeSources.length > 0 ? (
              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-primary" />
                <span className="max-w-[100px] truncate">{activeSources.length} sources</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="hidden sm:inline">Sources</span>
              </div>
            )}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 max-h-[400px] overflow-auto">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => handleSingleSourceSelect(null)}
              className="flex items-center justify-between"
            >
              <span>Toutes les sources</span>
              {activeSource === null && activeSources.length === 0 && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t">
              Sources disponibles
            </div>
            
            {sources.map((source) => (
              <DropdownMenuItem
                key={source}
                className="flex items-center space-x-2"
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                <Checkbox 
                  id={`source-${source}`}
                  checked={activeSources.includes(source)}
                  onCheckedChange={() => handleMultiSourceSelect(source)}
                />
                <label 
                  htmlFor={`source-${source}`}
                  className="flex-1 cursor-pointer"
                  onClick={() => handleMultiSourceSelect(source)}
                >
                  {source}
                </label>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {activeSources.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {activeSources.map(source => (
            <Badge 
              key={source} 
              variant="outline"
              className="flex items-center gap-1 text-xs"
            >
              {source}
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0 ml-1"
                onClick={() => handleMultiSourceSelect(source)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            className="h-5 text-xs p-1"
            onClick={clearAllSources}
          >
            Effacer tout
          </Button>
        </div>
      )}
    </div>
  );
};

