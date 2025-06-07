
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useMediaRating } from "@/hooks/use-media-rating";
import { MediaType } from "@/types";
import { RatingSlider } from "@/components/media-rating/rating-slider";
import { cn } from "@/lib/utils";

interface CritiqueTabProps {
  mediaId: string;
  mediaType: MediaType;
  initialRating?: number;
  initialReview?: string;
}

const ratingSchema = z.object({
  rating: z.number().min(1).max(10),
  review: z.string().optional(),
});

type RatingFormData = z.infer<typeof ratingSchema>;

export function CritiqueTab({ mediaId, mediaType, initialRating, initialReview }: CritiqueTabProps) {
  const { toast } = useToast();
  const { submitRating, isSubmitting, userRating, userReview } = useMediaRating(mediaId, mediaType);
  const [localRating, setLocalRating] = useState(userRating || initialRating || 5);

  const form = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: userRating || initialRating || 5,
      review: userReview || initialReview || "",
    },
  });

  useEffect(() => {
    if (userRating !== null) {
      setLocalRating(userRating);
      form.setValue("rating", userRating);
    }
    if (userReview !== null) {
      form.setValue("review", userReview);
    }
  }, [userRating, userReview, form]);

  const onSubmit = async (data: RatingFormData) => {
    const success = await submitRating({
      rating: data.rating,
      notes: data.review || "",
    });

    if (success) {
      toast({
        title: "Note enregistrée",
        description: "Votre critique a été sauvegardée avec succès",
      });
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-emerald-500 bg-emerald-50 border-emerald-200";
    if (rating >= 6) return "text-green-500 bg-green-50 border-green-200";
    if (rating >= 4) return "text-yellow-500 bg-yellow-50 border-yellow-200";
    return "text-red-500 bg-red-50 border-red-200";
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 9) return "Exceptionnel";
    if (rating >= 8) return "Excellent";
    if (rating >= 7) return "Très bon";
    if (rating >= 6) return "Bon";
    if (rating >= 5) return "Moyen";
    if (rating >= 4) return "Décevant";
    return "Mauvais";
  };

  return (
    <div className="space-y-6 p-4">
      <Card className={cn("transition-all duration-200", getRatingColor(localRating))}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Ma critique</span>
            <div className="flex items-center gap-2">
              <span className={cn("text-2xl font-bold", getRatingColor(localRating).split(' ')[0])}>
                {localRating}/10
              </span>
              <span className={cn("text-sm font-medium px-2 py-1 rounded-full", getRatingColor(localRating))}>
                {getRatingLabel(localRating)}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <RatingSlider
                    value={localRating}
                    onChange={(rating) => {
                      setLocalRating(rating);
                      field.onChange(rating);
                    }}
                  />
                )}
              />

              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mon avis (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Partagez votre avis sur ce média..."
                        className="min-h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer ma critique"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
