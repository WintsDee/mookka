
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { NotesTextarea } from "../progression/notes-textarea";
import { MediaStatus } from "@/types";
import { StatusOption } from "./types";

interface StatusSelectionProps {
  statusOptions: StatusOption[];
  selectedStatus: MediaStatus | null;
  notes: string;
  mediaTitle: string;
  isAddingToLibrary: boolean;
  onStatusSelect: (status: MediaStatus) => void;
  onNotesChange: (value: string) => void;
  onAddToLibrary: () => void;
}

export function StatusSelection({
  statusOptions,
  selectedStatus,
  notes,
  mediaTitle,
  isAddingToLibrary,
  onStatusSelect,
  onNotesChange,
  onAddToLibrary
}: StatusSelectionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {statusOptions.map((option) => (
            <div
              key={option.value}
              className={`
                p-4 rounded-lg border cursor-pointer transition-colors
                ${selectedStatus === option.value 
                  ? `${option.bgColor} ${option.textColor} ${option.borderColor}` 
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'}
              `}
              onClick={() => onStatusSelect(option.value)}
            >
              <h3 className="font-medium">{option.label}</h3>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <NotesTextarea 
        notes={notes} 
        onNotesChange={onNotesChange}
        placeholder={`Vos notes personnelles sur ${mediaTitle}...`}
      />
      
      <div className="flex justify-end pt-2">
        <Button 
          onClick={onAddToLibrary} 
          disabled={!selectedStatus || isAddingToLibrary}
        >
          {isAddingToLibrary ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ajout en cours...
            </>
          ) : (
            selectedStatus === 'completed' 
              ? 'Continuer vers la notation' 
              : 'Ajouter à ma bibliothèque'
          )}
        </Button>
      </div>
    </div>
  );
}
