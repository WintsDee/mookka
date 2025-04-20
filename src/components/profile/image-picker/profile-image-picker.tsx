
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon } from "lucide-react";
import { ImagePickerDialog } from "./image-picker-dialog";

interface ProfileImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  type: 'avatar' | 'cover';
}

export function ProfileImagePicker({ value, onChange, type }: ProfileImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleConfirmSelection = () => {
    if (selectedImage) {
      onChange(selectedImage);
      setOpen(false);
      setSelectedImage(null);
    }
  };

  return (
    <div>
      <div 
        className={`
          ${type === 'avatar' ? 'w-24 h-24 rounded-full mx-auto' : 'w-full h-32 rounded-lg'} 
          border-2 border-dashed border-muted-foreground/25 relative overflow-hidden
          transition-all hover:border-primary/50
        `}
      >
        {value ? (
          <img 
            src={value} 
            alt={type === 'avatar' ? "Avatar" : "Bannière"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
          </div>
        )}
        
        <Button 
          className="absolute inset-0 w-full h-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
          variant="ghost"
          onClick={() => setOpen(true)}
        >
          <Upload className="mr-2" /> Modifier
        </Button>
      </div>
      
      <ImagePickerDialog
        open={open}
        onOpenChange={setOpen}
        type={type}
        selectedImage={selectedImage}
        onSelect={setSelectedImage}
        onConfirm={handleConfirmSelection}
      />
    </div>
  );
}
