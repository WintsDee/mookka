
import React from "react";
import { ImageGrid } from "./image-grid";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface UploadTabProps {
  selectedImage: string | null;
  onImageSelect: (imageUrl: string) => void;
}

export function UploadTab({
  selectedImage,
  onImageSelect,
}: UploadTabProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner une image (PNG, JPEG, etc.)",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelect(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <Button 
        variant="outline" 
        className="w-full mb-4"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mr-2 h-4 w-4" />
        Importer une image
      </Button>
      
      {selectedImage && (
        <div className="relative aspect-square rounded-md overflow-hidden">
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
