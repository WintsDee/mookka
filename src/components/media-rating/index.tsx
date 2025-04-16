
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useMediaRating, MediaRatingData } from "@/hooks/use-media-rating";
import { RatingSlider } from "./rating-slider";
import { ReviewTextarea } from "./review-textarea";
import { MediaType } from "@/types";
import { useProfile } from "@/hooks/use-profile";

interface MediaRatingProps {
  mediaId: string;
  mediaType: MediaType;
  initialRating?: number;
  initialReview?: string;
}

export function MediaRating({ mediaId, mediaType, initialRating = 0, initialReview = "" }: MediaRatingProps) {
  const {
    isLoading,
    isSubmitting,
    userRating,
    userReview,
    saveRating
  } = useMediaRating(mediaId, mediaType);
  
  const { isAuthenticated } = useProfile();
  
  const form = useForm<MediaRatingData>({
    defaultValues: {
      rating: initialRating || 0,
      review: initialReview || ""
    }
  });
  
  // Update form values when data is loaded
  useEffect(() => {
    if (userRating || userReview) {
      form.reset({
        rating: userRating || 0,
        review: userReview || ""
      });
    }
  }, [userRating, userReview, form]);

  const onSubmit = (values: MediaRatingData) => {
    saveRating(values);
  };

  // Save rating automatically when it changes
  const handleRatingChange = async (newRating: number) => {
    form.setValue("rating", newRating);
    await form.handleSubmit(onSubmit)();
  };

  // Save review automatically when focus is lost
  const handleReviewChange = async () => {
    await form.handleSubmit(onSubmit)();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-secondary/40 border-border">
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="rating"
                render={() => (
                  <RatingSlider 
                    form={form} 
                    userRating={form.watch("rating")} 
                    onRatingChange={handleRatingChange} 
                  />
                )}
              />
              
              <FormField
                control={form.control}
                name="review"
                render={() => (
                  <ReviewTextarea 
                    form={form} 
                    onReviewChange={handleReviewChange} 
                  />
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer ma critique"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
