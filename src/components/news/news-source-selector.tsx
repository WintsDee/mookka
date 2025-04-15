
import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NewsSourceSelectorProps {
  sources: string[];
  activeSource: string | null;
  onSourceChange: (source: string | null) => void;
}

export const NewsSourceSelector: React.FC<NewsSourceSelectorProps> = ({
  sources,
  activeSource,
  onSourceChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          {activeSource ? `Source: ${activeSource}` : "Toutes les sources"}
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => onSourceChange(null)}
            className="flex items-center justify-between"
          >
            <span>Toutes les sources</span>
            {activeSource === null && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
          
          {sources.map((source) => (
            <DropdownMenuItem
              key={source}
              onClick={() => onSourceChange(source)}
              className="flex items-center justify-between"
            >
              <span>{source}</span>
              {activeSource === source && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
