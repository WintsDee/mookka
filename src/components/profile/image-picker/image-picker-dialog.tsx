
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GalleryTab } from "./gallery-tab";
import { UploadTab } from "./upload-tab";

interface ImagePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'avatar' | 'cover';
  selectedImage: string | null;
  onSelect: (url: string) => void;
  onConfirm: () => void;
}

export function ImagePickerDialog({
  open,
  onOpenChange,
  type,
  selectedImage,
  onSelect,
  onConfirm,
}: ImagePickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onSelect={onSelect}
            />
          </TabsContent>
          
          <TabsContent value="upload" className="mt-4">
            <UploadTab
              type={type}
              onChange={(url) => {
                onSelect(url);
                onOpenChange(false);
              }}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          
          <Button 
            onClick={onConfirm}
            disabled={!selectedImage}
          >
            Confirmer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
