
import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { MessageCircle, EyeOff, PenSquare, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Add the CSS class for spoilers directly to the global styles
// This will be automatically added to the document head
const spoilerStyles = `
  .spoiler-text {
    background-color: #1f1f1f;
    color: transparent;
    border-radius: 2px;
    padding: 0 2px;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
  }
  .spoiler-text:hover {
    color: rgba(255, 255, 255, 0.9);
    background-color: rgba(31, 31, 31, 0.8);
  }
`;

interface ReviewTextareaProps {
  userReview: string;
  onReviewChange: (review: string) => void;
}

export function ReviewTextarea({ userReview, onReviewChange }: ReviewTextareaProps) {
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [spoilerActive, setSpoilerActive] = useState(false);
  const [review, setReview] = useState(userReview || "");
  
  // Add the styles to the document head when the component mounts
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = spoilerStyles;
    document.head.appendChild(styleEl);
    
    // Clean up the style element when the component unmounts
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Update the review when the prop changes
  useEffect(() => {
    setReview(userReview || "");
  }, [userReview]);
  
  const handleSpoilerToggle = () => {
    setSpoilerActive(!spoilerActive);
    
    // Ajouter ou retirer les balises de spoiler dans le texte
    if (!spoilerActive) {
      // Ajouter les balises si elles n'existent pas déjà
      if (!review.includes("[SPOILER]") && !review.includes("[/SPOILER]")) {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          const selectedText = selection.toString();
          const newText = review.replace(selectedText, `[SPOILER]${selectedText}[/SPOILER]`);
          setReview(newText);
          onReviewChange(newText);
        } else {
          // Si aucun texte n'est sélectionné, ajouter les balises à la fin
          const newText = review + " [SPOILER]Écrivez votre spoiler ici[/SPOILER]";
          setReview(newText);
          onReviewChange(newText);
        }
      }
    }
  };

  const formatReviewWithSpoilers = (text: string) => {
    if (!text) return "";
    
    // Remplacer les balises de spoiler par des spans avec style
    const formattedText = text.replace(
      /\[SPOILER\](.*?)\[\/SPOILER\]/gs,
      '<span class="spoiler-text">$1</span>'
    );
    
    // Convertir les sauts de ligne en <br>
    return formattedText.replace(/\n/g, '<br>');
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setReview(newValue);
    onReviewChange(newValue);
  };

  return (
    <FormItem>
      <div className="flex items-center justify-between">
        <FormLabel className="flex items-center gap-1 text-sm">
          <MessageCircle className="h-4 w-4" /> 
          Critique
        </FormLabel>
        
        <Tabs value={mode} onValueChange={(v) => setMode(v as "write" | "preview")} className="h-7">
          <TabsList className="h-7 p-0">
            <TabsTrigger value="write" className="h-7 px-2 text-xs">
              <PenSquare className="h-3.5 w-3.5 mr-1" />
              Écrire
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-7 px-2 text-xs">
              <Check className="h-3.5 w-3.5 mr-1" />
              Aperçu
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {mode === "write" ? (
        <div className="space-y-2">
          <FormControl>
            <Textarea
              value={review}
              placeholder="Partagez votre critique de ce média..."
              className="resize-none bg-background/60 min-h-32"
              onChange={handleReviewChange}
            />
          </FormControl>
          
          <div className="flex justify-end">
            <Button 
              type="button" 
              size="sm" 
              variant={spoilerActive ? "secondary" : "outline"}
              className="h-7 text-xs"
              onClick={handleSpoilerToggle}
            >
              <EyeOff className="h-3.5 w-3.5 mr-1.5" />
              Spoiler
            </Button>
          </div>
        </div>
      ) : (
        <Card className="border border-border overflow-hidden">
          <CardContent className="p-4">
            {review ? (
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: formatReviewWithSpoilers(review) }}
              />
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Aucune critique rédigée pour le moment.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </FormItem>
  );
}
