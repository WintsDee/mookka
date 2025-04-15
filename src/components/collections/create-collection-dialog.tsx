
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CollectionType, CollectionVisibility } from '@/types/collection';
import { Lock, Globe, Users, Tag, ListChecks, Heart } from 'lucide-react';

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    description: string;
    type: CollectionType;
    visibility: CollectionVisibility;
  }) => void;
  isLoading?: boolean;
}

export function CreateCollectionDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false
}: CreateCollectionDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<CollectionType>('thematic');
  const [visibility, setVisibility] = useState<CollectionVisibility>('private');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      type,
      visibility
    });
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setType('thematic');
    setVisibility('private');
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm();
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Créer une collection</DialogTitle>
            <DialogDescription>
              Créez une nouvelle collection pour organiser vos médias.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la collection</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Films d'action des années 90"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Une brève description de votre collection..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Type de collection</Label>
              <RadioGroup 
                value={type} 
                onValueChange={(value) => setType(value as CollectionType)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="thematic" id="type-thematic" />
                  <Label htmlFor="type-thematic" className="flex items-center gap-2 cursor-pointer">
                    <Tag size={16} /> Thématique
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ranking" id="type-ranking" />
                  <Label htmlFor="type-ranking" className="flex items-center gap-2 cursor-pointer">
                    <ListChecks size={16} /> Classement
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selection" id="type-selection" />
                  <Label htmlFor="type-selection" className="flex items-center gap-2 cursor-pointer">
                    <Heart size={16} /> Sélection
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Visibilité</Label>
              <RadioGroup 
                value={visibility} 
                onValueChange={(value) => setVisibility(value as CollectionVisibility)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="visibility-private" />
                  <Label htmlFor="visibility-private" className="flex items-center gap-2 cursor-pointer">
                    <Lock size={16} /> Privée (visible uniquement par vous)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="visibility-public" />
                  <Label htmlFor="visibility-public" className="flex items-center gap-2 cursor-pointer">
                    <Globe size={16} /> Publique (visible par tous)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="collaborative" id="visibility-collaborative" />
                  <Label htmlFor="visibility-collaborative" className="flex items-center gap-2 cursor-pointer">
                    <Users size={16} /> Collaborative (modifiable par vous et vos collaborateurs)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!name || isLoading}>
              {isLoading ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
