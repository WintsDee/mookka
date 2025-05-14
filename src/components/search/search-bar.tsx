
import React from "react";
import { Input } from "@/components/ui/input";
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
        className={`pl-10 py-6 border-none shadow-sm ${selectedTypeColor} h-[44px]`}
        disabled={isDisabled}
        autoComplete="off"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center pointer-events-none">
        {isLoading ? (
          <Loader2 className="text-muted-foreground animate-spin h-[18px] w-[18px]" />
        ) : (
          <Search className="text-muted-foreground h-[18px] w-[18px]" />
        )}
      </div>
    </div>
  );
};
