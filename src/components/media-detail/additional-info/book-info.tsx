
import React from "react";
import { User, Building, BookOpen, Hash, Languages, Layers, Bookmark, Calendar, Award } from "lucide-react";
import { InfoItem } from "./info-item";
import { BadgesSection } from "./badges-section";

interface BookInfoProps {
  author?: string;
  publisher?: string;
  pages?: number;
  isbn?: string;
  isbn10?: string;
  language?: string;
  printType?: string;
  maturityRating?: string;
  publishDate?: string;
  awards?: string[];
}

export function BookInfo({
  author,
  publisher,
  pages,
  isbn,
  isbn10,
  language,
  printType,
  maturityRating,
  publishDate,
  awards
}: BookInfoProps) {
  // Calculate if the component will render anything
  const hasInfo = author || publisher || pages || isbn || isbn10 || language || printType || maturityRating || publishDate;
  
  if (!hasInfo && !awards?.length) return null;
  
  return (
    <>
      {author && (
        <InfoItem 
          icon={<User className="h-4 w-4 text-muted-foreground" />}
          label="Auteur" 
          value={author} 
        />
      )}
      
      {publisher && (
        <InfoItem 
          icon={<Building className="h-4 w-4 text-muted-foreground" />}
          label="Éditeur" 
          value={publisher} 
        />
      )}
      
      {pages !== undefined && (
        <InfoItem 
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
          label="Pages" 
          value={pages.toString()} 
        />
      )}
      
      {isbn && (
        <InfoItem 
          icon={<Hash className="h-4 w-4 text-muted-foreground" />}
          label="ISBN-13" 
          value={isbn} 
        />
      )}
      
      {isbn10 && (
        <InfoItem 
          icon={<Hash className="h-4 w-4 text-muted-foreground" />}
          label="ISBN-10" 
          value={isbn10} 
        />
      )}
      
      {language && (
        <InfoItem 
          icon={<Languages className="h-4 w-4 text-muted-foreground" />}
          label="Langue" 
          value={language} 
        />
      )}
      
      {printType && (
        <InfoItem 
          icon={<Layers className="h-4 w-4 text-muted-foreground" />}
          label="Type d'impression" 
          value={printType} 
        />
      )}
      
      {maturityRating && (
        <InfoItem 
          icon={<Bookmark className="h-4 w-4 text-muted-foreground" />}
          label="Classification" 
          value={maturityRating} 
        />
      )}
      
      {publishDate && (
        <InfoItem 
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
          label="Date de publication" 
          value={publishDate}
          showSeparator={!!awards?.length}
        />
      )}
      
      <BadgesSection 
        title="Récompenses" 
        items={awards} 
        icon={<Award className="h-4 w-4 text-muted-foreground" />} 
        variant="outline" 
        maxItems={5}
      />
    </>
  );
}
