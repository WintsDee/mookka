
import { useCallback } from "react";
import { Upload, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useImageUpload } from "./use-image-upload";

interface UploadTabProps {
  type: 'avatar' | 'cover';
  onChange: (url: string) => void;
}

export function UploadTab({ type, onChange }: UploadTabProps) {
  const { toast } = useToast();
  const { uploadImage, isUploading } = useImageUpload(type, onChange);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "L'image ne doit pas dépasser 2Mo",
        variant: "destructive",
      });
      return;
    }

    await uploadImage(file);
  }, [toast, uploadImage]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-primary/50 transition-colors">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label 
          htmlFor="image-upload" 
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {isUploading ? 'Upload en cours...' : 'Cliquez pour choisir une image'}
          </span>
        </label>
      </div>
      
      <div className="text-sm text-muted-foreground flex items-center">
        <AlertTriangle size={14} className="mr-1" />
        Format accepté : JPG, PNG. Taille max : 2Mo
      </div>
    </div>
  );
}
