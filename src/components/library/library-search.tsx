
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
        type="text"
        placeholder="Rechercher dans ma bibliothèque..."
        className="pl-10"
        value={value}
        onChange={onChange}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
    </div>
  );
};
