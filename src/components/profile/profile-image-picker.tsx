
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_AVATAR, DEFAULT_COVER } from "@/hooks/use-profile";
import { UNSPLASH_IMAGES } from "./image-picker/constants";
import { SearchTab } from "./image-picker/search-tab";
import { GalleryTab } from "./image-picker/gallery-tab";

interface ProfileImagePickerProps {
  value: string;
  onChange: (value: string) => void;
  type: 'avatar' | 'cover';
}

export function ProfileImagePicker({ value, onChange, type }: ProfileImagePickerProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>(UNSPLASH_IMAGES);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults(UNSPLASH_IMAGES);
      return;
    }
    
    const results = UNSPLASH_IMAGES.filter(
      url => url.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results.length ? results : UNSPLASH_IMAGES);
  };

  const checkImageAppropriateness = async (imageUrl: string): Promise<boolean> => {
    setIsChecking(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const isAppropriate = UNSPLASH_IMAGES.includes(imageUrl) || 
                           imageUrl === DEFAULT_AVATAR || 
                           imageUrl === DEFAULT_COVER;
      return isAppropriate;
    } catch (error) {
      console.error("Error checking image:", error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleConfirmSelection = async () => {
    if (!selectedImage) return;
    
    const isAppropriate = await checkImageAppropriateness(selectedImage);
    
    if (!isAppropriate) {
      toast({
        title: "Image inappropriée",
        description: "Cette image ne peut pas être utilisée. Veuillez en choisir une autre.",
        variant: "destructive"
      });
      return;
    }
    
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
          </DialogHeader>
          
          <Tabs defaultValue="gallery">
            <TabsList className="w-full">
              <TabsTrigger value="gallery" className="flex-1">Galerie</TabsTrigger>
              <TabsTrigger value="search" className="flex-1">Rechercher</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery">
              <GalleryTab
                images={UNSPLASH_IMAGES}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
              />
            </TabsContent>
            
            <TabsContent value="search">
              <SearchTab
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearch={handleSearch}
                searchResults={searchResults}
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
              disabled={!selectedImage || isChecking}
              className="relative"
            >
              {isChecking ? (
                <>
                  <span className="opacity-0">Confirmer</span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    Vérification...
                  </span>
                </>
              ) : (
                'Confirmer'
              )}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center mt-2">
            <AlertTriangle size={14} className="mr-1" />
            Les images sont vérifiées avant publication pour garantir qu'elles sont appropriées.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
