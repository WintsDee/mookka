import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_AVATAR, DEFAULT_COVER } from "@/hooks/use-profile";
import { THEMED_IMAGES } from "./image-picker/constants";
import { GalleryTab } from "./image-picker/gallery-tab";
import { UploadTab } from "./image-picker/search-tab";

interface ProfileImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  type: 'avatar' | 'cover';
}

export function ProfileImagePicker({ value, onChange, type }: ProfileImagePickerProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConfirmSelection = () => {
    if (!selectedImage) return;
    
    onChange(selectedImage);
    setSearchOpen(false);
    setSelectedImage(null);
    
    toast({
      title: "Image sélectionnée",
      description: type === 'avatar' ? "Votre avatar a été mis à jour." : "Votre bannière a été mise à jour."
    });
  };

  return (
    <div>
      <div 
        className={`
          ${type === 'avatar' ? 'w-24 h-24 rounded-full mx-auto' : 'w-full h-32 rounded-lg'} 
          border-2 border-dashed border-muted-foreground/25 relative overflow-hidden
        `}
      >
        <img 
          src={value} 
          alt={type === 'avatar' ? "Avatar" : "Bannière"}
          className="w-full h-full object-cover"
        />
        
        <Button 
          className="absolute inset-0 w-full h-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
          variant="ghost"
          onClick={() => setSearchOpen(true)}
        >
          <Upload className="text-white" />
        </Button>
      </div>
      
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {type === 'avatar' ? 'Choisir un nouvel avatar' : 'Choisir une nouvelle bannière'}
            </DialogTitle>
            <DialogDescription>
              Sélectionnez une image de la galerie ou importez la vôtre
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="gallery">
            <TabsList className="w-full">
              <TabsTrigger value="gallery" className="flex-1">Galerie</TabsTrigger>
              <TabsTrigger value="upload" className="flex-1">Importer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery">
              <GalleryTab
                images={THEMED_IMAGES}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
              />
            </TabsContent>
            
            <TabsContent value="upload">
              <UploadTab
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => setSearchOpen(false)}
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
