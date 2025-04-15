
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

interface MediaRatingProps {
  mediaId: string;
  mediaType: string;
  initialRating?: number;
  initialReview?: string;
}

interface RatingFormValues {
  rating: number;
  review: string;
}

export function MediaRating({ mediaId, mediaType, initialRating = 0, initialReview = "" }: MediaRatingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(initialRating);
  const { toast } = useToast();
  
  const form = useForm<RatingFormValues>({
    defaultValues: {
      rating: initialRating,
      review: initialReview
    }
  });
  
  const onSubmit = async (values: RatingFormValues) => {
    setIsSubmitting(true);
    
    // Simulating API call to save rating
    try {
      // This would be replaced with an actual API call in a real implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setUserRating(values.rating);
      
      toast({
        title: "Note enregistrée",
        description: `Vous avez noté ce ${
          mediaType === 'film' ? 'film' : 
          mediaType === 'serie' ? 'série' : 
          mediaType === 'book' ? 'livre' : 'jeu'
        } ${values.rating}/10`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre note",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-2 flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        Votre évaluation
      </h2>
      
      <Card className="bg-secondary/40 border-border">
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel className="text-sm">Note</FormLabel>
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border",
                        userRating >= 7 ? "bg-green-500/20 border-green-500/40 text-green-400" :
                        userRating >= 4 ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400" :
                        "bg-red-500/20 border-red-500/40 text-red-400"
                      )}>
                        <span className="font-bold">{field.value}</span>
                      </div>
                    </div>
                    <FormControl>
                      <Slider
                        defaultValue={[field.value]}
                        max={10}
                        step={1}
                        onValueChange={(vals) => {
                          field.onChange(vals[0]);
                        }}
                        className="py-4"
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1</span>
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Avis (optionnel)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Partagez votre avis sur ce média..."
                        className="resize-none bg-background/60"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
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
                  "Enregistrer ma note"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
