
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Film, Tv, Book, Gamepad } from "lucide-react";

interface MediaPreferencesProps {
  preferences: string[];
  onChange: (preferences: string[]) => void;
}

export function MediaPreferences({ preferences, onChange }: MediaPreferencesProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white">
        Vos préférences médias
      </label>
      <ToggleGroup 
        type="multiple"
        value={preferences}
        onValueChange={onChange}
        className="flex flex-wrap gap-2 justify-start"
      >
        <ToggleGroupItem value="films" className="bg-white/10 data-[state=on]:bg-white/30 text-white">
          <Film className="w-4 h-4 mr-2" />
          Films
        </ToggleGroupItem>
        <ToggleGroupItem value="series" className="bg-white/10 data-[state=on]:bg-white/30 text-white">
          <Tv className="w-4 h-4 mr-2" />
          Séries
        </ToggleGroupItem>
        <ToggleGroupItem value="books" className="bg-white/10 data-[state=on]:bg-white/30 text-white">
          <Book className="w-4 h-4 mr-2" />
          Livres
        </ToggleGroupItem>
        <ToggleGroupItem value="games" className="bg-white/10 data-[state=on]:bg-white/30 text-white">
          <Gamepad className="w-4 h-4 mr-2" />
          Jeux
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
