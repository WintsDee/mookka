
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MediaType } from "@/types";
import { useMediaRating } from "@/hooks/use-media-rating";
import { RatingProgress } from "./rating-progress";
import { Loader2, Star } from "lucide-react";

const formSchema = z.object({
  rating: z.number().min(1).max(10),
  review: z.string().optional(),
});

interface MediaRatingProps {
  mediaId: string;
  mediaType: MediaType;
  initialNotes?: string;
  onRatingComplete?: () => void;
  onRatingError?: () => void;
}

export function MediaRating({ 
  mediaId, 
  mediaType, 
  initialNotes = "",
  onRatingComplete,
  onRatingError
}: MediaRatingProps) {
  const { submitRating, isSubmitting, userRating } = useMediaRating(mediaId, mediaType);
  const [rating, setRating] = useState(userRating || 5);
  const [review, setReview] = useState(initialNotes);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: userRating || 5,
      review: initialNotes,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const success = await submitRating({
        rating: values.rating,
        review: values.review || "",
        notes: values.review || ""
      });
      
      if (success) {
        onRatingComplete?.();
      } else {
        onRatingError?.();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      onRatingError?.();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Noter ce média
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <RatingProgress
                  value={rating}
                  onChange={(newRating) => {
                    setRating(newRating);
                    field.onChange(newRating);
                  }}
                />
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="review">Votre avis (optionnel)</Label>
              <Textarea
                id="review"
                placeholder="Partagez votre avis sur ce média..."
                value={review}
                onChange={(e) => {
                  setReview(e.target.value);
                  form.setValue("review", e.target.value);
                }}
                className="min-h-[100px]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {userRating ? "Mettre à jour" : "Publier"} ma critique
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
