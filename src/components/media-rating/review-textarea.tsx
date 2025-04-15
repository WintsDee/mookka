
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { MessageCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { MediaRatingData } from "@/hooks/use-media-rating";

interface ReviewTextareaProps {
  form: UseFormReturn<MediaRatingData>;
  onReviewChange: () => void;
}

export function ReviewTextarea({ form, onReviewChange }: ReviewTextareaProps) {
  return (
    <FormItem>
      <FormLabel className="flex items-center gap-1 text-sm">
        <MessageCircle className="h-4 w-4" /> 
        Critique
      </FormLabel>
      <FormControl>
        <Textarea
          placeholder="Partagez votre critique de ce média..."
          className="resize-none bg-background/60 min-h-32"
          {...form.register("review")}
          onChange={(e) => {
            form.setValue("review", e.target.value);
            // Attendre un peu avant d'enregistrer pour éviter trop de requêtes
            const debounceTimer = setTimeout(() => {
              onReviewChange();
            }, 500);
            return () => clearTimeout(debounceTimer);
          }}
        />
      </FormControl>
    </FormItem>
  );
}
