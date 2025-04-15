
import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated } = useProfile();
  
  const form = useForm<RatingFormValues>({
    defaultValues: {
      rating: initialRating,
      review: initialReview
    }
  });
  
  // Charger la note existante lors du chargement du composant
  useEffect(() => {
    const fetchRating = async () => {
      if (!isAuthenticated || !mediaId) return;
      
      try {
        setIsLoading(true);
        const { data: user } = await supabase.auth.getUser();
        
        if (!user.user) {
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('user_media')
          .select('user_rating, notes')
          .eq('media_id', mediaId)
          .eq('user_id', user.user.id)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Erreur lors de la récupération de la note:", error);
          return;
        }
        
        if (data) {
          const userRating = data.user_rating || 0;
          setUserRating(userRating);
          form.reset({
            rating: userRating,
            review: data.notes || ''
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la note:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRating();
  }, [mediaId, isAuthenticated, form]);

  const onSubmit = async (values: RatingFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour noter ce média",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error("Utilisateur non connecté");
      }
      
      // Auto-save feature - handle immediate saving without submit
      const handleAutoSave = async () => {
        // Vérifier si le média existe déjà dans la bibliothèque de l'utilisateur
        const { data: existingMedia } = await supabase
          .from('user_media')
          .select('id')
          .eq('media_id', mediaId)
          .eq('user_id', user.user.id)
          .maybeSingle();
        
        if (existingMedia) {
          // Mettre à jour la note existante
          const { error } = await supabase
            .from('user_media')
            .update({
              user_rating: values.rating,
              notes: values.review,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingMedia.id);
            
          if (error) throw error;
        } else {
          // Créer une nouvelle entrée
          const { error } = await supabase
            .from('user_media')
            .insert({
              user_id: user.user.id,
              media_id: mediaId,
              user_rating: values.rating,
              notes: values.review,
              status: 'rated'
            });
            
          if (error) throw error;
        }
        
        setUserRating(values.rating);
      };
      
      await handleAutoSave();
      
      toast({
        title: "Critique enregistrée",
        description: `Votre critique a été enregistrée`,
      });
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de la note:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre critique",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour sauvegarder automatiquement lorsque le rating change
  const handleRatingChange = async (newRating: number) => {
    form.setValue("rating", newRating);
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
      {!isAuthenticated ? (
        <Card className="bg-secondary/40 border-border">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Vous devez être connecté pour critiquer ce média
            </p>
            <Button variant="default" size="sm">
              Se connecter
            </Button>
          </CardContent>
        </Card>
      ) : (
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
                            handleRatingChange(vals[0]);
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
                      <FormLabel className="flex items-center gap-1 text-sm">
                        <MessageCircle className="h-4 w-4" /> 
                        Critique
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Partagez votre critique de ce média..."
                          className="resize-none bg-background/60 min-h-32"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            // Attendre un peu avant d'enregistrer pour éviter trop de requêtes
                            const debounceTimer = setTimeout(() => {
                              form.handleSubmit(onSubmit)();
                            }, 500);
                            return () => clearTimeout(debounceTimer);
                          }}
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
                    "Enregistrer ma critique"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
