
import React from "react";
import { Check, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewsSourceSelectorProps {
  sources: string[];
  selectedSource: string | null;
  onSourceChange: (source: string | null) => void;
}

export const NewsSourceSelector: React.FC<NewsSourceSelectorProps> = ({
  sources,
  selectedSource,
  onSourceChange,
}) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={selectedSource ? "bg-secondary" : ""}
        >
          <Filter size={16} className="mr-2" />
          {selectedSource || "Sources"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sources</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-72">
          <DropdownMenuItem 
            onClick={() => onSourceChange(null)}
            className="cursor-pointer"
          >
            {!selectedSource && <Check size={14} className="mr-2" />}
            Toutes les sources
          </DropdownMenuItem>
          {sources.map((source) => (
            <DropdownMenuItem
              key={source}
              onClick={() => onSourceChange(source)}
              className="cursor-pointer"
            >
              {selectedSource === source && <Check size={14} className="mr-2" />}
              {source}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
