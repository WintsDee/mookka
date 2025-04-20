import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DEFAULT_AVATARS } from "@/config/avatars/avatar-utils";

interface GalleryTabProps {
  selectedImage: string | null;
  onSelect: (imageUrl: string) => void;
}

export function GalleryTab({ selectedImage, onSelect }: GalleryTabProps) {
  return (
    <ScrollArea className="h-[300px]">
      <div className="grid grid-cols-3 gap-3">
        {DEFAULT_AVATARS.map((img, idx) => (
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
  );
}
