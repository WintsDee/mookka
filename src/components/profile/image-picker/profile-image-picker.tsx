
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ImageIcon } from "lucide-react";
import { GalleryTab } from "./gallery-tab";
import { UploadTab } from "./upload-tab";

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
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {type === 'avatar' ? 'Choisir un nouvel avatar' : 'Choisir une nouvelle bannière'}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="gallery">
            <TabsList className="w-full">
              <TabsTrigger value="gallery" className="flex-1">Galerie</TabsTrigger>
              <TabsTrigger value="upload" className="flex-1">Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery" className="mt-4">
              <GalleryTab 
                selectedImage={selectedImage}
                onSelect={setSelectedImage}
              />
            </TabsContent>
            
            <TabsContent value="upload" className="mt-4">
              <UploadTab
                type={type}
                onChange={(url) => {
                  setSelectedImage(url);
                  setOpen(false);
                }}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            
            <Button 
              onClick={handleConfirmSelection}
              disabled={!selectedImage}
            >
              Confirmer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
