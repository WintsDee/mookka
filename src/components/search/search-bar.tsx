
import React from "react";
import { Input } from "@/components/ui/input";
import { MediaType } from "@/types";
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  isDisabled: boolean;
  selectedTypeColor: string;
}

export const SearchBar = ({
  placeholder,
  value,
  onChange,
  isLoading,
  isDisabled,
  selectedTypeColor,
}: SearchBarProps) => {
  return (
    <div className="relative mt-6">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`pl-10 py-6 border-none shadow-sm ${selectedTypeColor}`}
        disabled={isDisabled}
      />
      {isLoading ? (
        <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground animate-spin" size={18} />
      ) : (
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      )}
    </div>
  );
};
