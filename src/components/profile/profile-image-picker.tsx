import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Upload, Check, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_AVATAR, DEFAULT_COVER } from "@/hooks/use-profile";
import { ScrollArea } from "@/components/ui/scroll-area";

// Predefined Unsplash images that are free to use
const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1579547621869-0f6d142906fc?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601643157091-ce5c665179ab?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1642479755015-20fa45ea1e2b?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=500&auto=format&fit=crop",
];

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

  // Simple search function filtering from predefined images
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

  // Mock function to check if image is appropriate
  // In a real app, this would call an AI content moderation service
  const checkImageAppropriateness = async (imageUrl: string): Promise<boolean> => {
    setIsChecking(true);
    
    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For this example, we assume all predefined images are appropriate
      // In a real app, use an API like Google Cloud Vision API or similar
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

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
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
            
            <TabsContent value="gallery" className="mt-4">
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-2 gap-3">
                  {UNSPLASH_IMAGES.map((img, idx) => (
                    <div 
                      key={idx}
                      className={`
                        relative aspect-square rounded-md overflow-hidden cursor-pointer
                        ${selectedImage === img ? 'ring-2 ring-primary' : ''}
                      `}
                      onClick={() => handleImageSelect(img)}
                    >
                      <img 
                        src={img}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === img && (
                        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="search" className="mt-4">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Rechercher une image..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  <Search size={16} />
                </Button>
              </div>
              
              <ScrollArea className="h-[250px]">
                <div className="grid grid-cols-2 gap-3">
                  {searchResults.map((img, idx) => (
                    <div 
                      key={idx}
                      className={`
                        relative aspect-square rounded-md overflow-hidden cursor-pointer
                        ${selectedImage === img ? 'ring-2 ring-primary' : ''}
                      `}
                      onClick={() => handleImageSelect(img)}
                    >
                      <img 
                        src={img}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === img && (
                        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                          <Check size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
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
