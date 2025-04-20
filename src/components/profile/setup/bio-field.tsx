
import { Textarea } from "@/components/ui/textarea";

interface BioFieldProps {
  bio: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function BioField({ bio, onChange }: BioFieldProps) {
  return (
    <div>
      <label htmlFor="bio" className="block text-sm font-medium mb-2 text-white">
        Biographie
      </label>
      <Textarea
        id="bio"
        value={bio}
        onChange={onChange}
        placeholder="Parlez-nous un peu de vous..."
        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        rows={4}
      />
    </div>
  );
}
