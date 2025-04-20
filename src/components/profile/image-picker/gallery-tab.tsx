
import { Check, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DEFAULT_AVATARS } from "@/config/avatars/avatar-utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  filmAvatars, 
  gamingAvatars, 
  bookAvatars, 
  tvSeriesAvatars 
} from '@/config/avatars/media-themed-avatars';
import { artCultureAvatars, animationAvatars } from '@/config/avatars/culture-avatars';
import { natureAvatars } from '@/config/avatars/nature-avatars';
import { animalAvatars } from '@/config/avatars/animal-avatars';
import { techAvatars } from '@/config/avatars/tech-avatars';
import { abstractAvatars } from '@/config/avatars/abstract-avatars';

interface GalleryTabProps {
  selectedImage: string | null;
  onSelect: (imageUrl: string) => void;
}

type CategoryType = 'all' | 'films' | 'gaming' | 'books' | 'tv' | 'art' | 'animation' | 'nature' | 'animals' | 'tech' | 'abstract';

const categoryMap = {
  all: DEFAULT_AVATARS,
  films: filmAvatars,
  gaming: gamingAvatars,
  books: bookAvatars,
  tv: tvSeriesAvatars,
  art: artCultureAvatars,
  animation: animationAvatars,
  nature: natureAvatars,
  animals: animalAvatars,
  tech: techAvatars,
  abstract: abstractAvatars,
};

const categoryNames = {
  all: 'Tous',
  films: 'Films',
  gaming: 'Jeux vidéo',
  books: 'Livres',
  tv: 'Séries TV',
  art: 'Art & Culture',
  animation: 'Animation',
  nature: 'Nature',
  animals: 'Animaux',
  tech: 'Technologie',
  abstract: 'Abstrait',
};

export function GalleryTab({ selectedImage, onSelect }: GalleryTabProps) {
  const [category, setCategory] = useState<CategoryType>('all');
  const displayAvatars = categoryMap[category];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">
          {categoryNames[category]} ({displayAvatars.length})
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter size={14} className="mr-2" />
              Catégories
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(categoryMap) as CategoryType[]).map((cat) => (
              <DropdownMenuItem 
                key={cat}
                onClick={() => setCategory(cat)}
                className={category === cat ? "bg-muted" : ""}
              >
                {categoryNames[cat]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-3 gap-3">
          {displayAvatars.map((img, idx) => (
            <div 
              key={idx}
              className={`
                relative aspect-square rounded-md overflow-hidden cursor-pointer
                ${selectedImage === img ? 'ring-2 ring-primary' : ''}
                hover:ring-2 hover:ring-primary/50
              `}
              onClick={() => onSelect(img)}
            >
              <img 
                src={img}
                alt={`Avatar ${idx + 1}`}
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
    </div>
  );
}
