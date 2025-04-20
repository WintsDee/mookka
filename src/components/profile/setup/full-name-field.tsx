
import { Input } from "@/components/ui/input";

interface FullNameFieldProps {
  fullName: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FullNameField({ fullName, onChange }: FullNameFieldProps) {
  return (
    <div>
      <label htmlFor="full_name" className="block text-sm font-medium mb-2 text-white">
        Nom complet
      </label>
      <Input
        id="full_name"
        value={fullName}
        onChange={onChange}
        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
      />
    </div>
  );
}
