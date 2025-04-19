
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface NotesTextareaProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  placeholder?: string;
}

export function NotesTextarea({ notes, onNotesChange, placeholder = "Ajoutez vos notes personnelles ici..." }: NotesTextareaProps) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState(notes || "");
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onNotesChange(newValue);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Notes personnelles</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleExpanded}
          className="h-8 px-2"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              <span className="text-xs">Réduire</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              <span className="text-xs">Développer</span>
            </>
          )}
        </Button>
      </div>
      
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full resize-none transition-all"
        rows={expanded ? 8 : 3}
      />
    </div>
  );
}
