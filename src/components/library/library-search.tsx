
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface LibrarySearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

export const LibrarySearch = ({ value, onChange, onSearch }: LibrarySearchProps) => {
  return (
    <div className="relative flex-1">
      <Input
        type="search"
        placeholder="Rechercher dans ma bibliothèque..."
        className="pl-10 h-[44px]"
        value={value}
        onChange={onChange}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
        autoComplete="off"
        enterKeyHint="search"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
};
