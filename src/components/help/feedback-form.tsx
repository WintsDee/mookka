
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { submitFeedback } from "@/services/github/feedback-service";

// Modify the schema to ensure type is required
const feedbackSchema = z.object({
  type: z.enum(["bug", "idea", "suggestion"], {
    required_error: "Veuillez sélectionner un type de retour",
  }),
  message: z
    .string()
    .min(10, { message: "Le message doit contenir au moins 10 caractères" })
    .max(1000, { message: "Le message ne peut pas dépasser 1000 caractères" }),
  contact: z.string().optional(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export function FeedbackForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: undefined, // Ensure this matches the schema
      message: "",
      contact: "",
    },
  });

  async function onSubmit(data: FeedbackFormValues) {
    setIsSubmitting(true);
    try {
      // Explicitly cast to match FeedbackData type
      await submitFeedback({
        type: data.type,
        message: data.message,
        contact: data.contact,
      });
      
      toast({
        title: "Merci pour votre retour !",
        description: "Votre feedback a été envoyé avec succès.",
      });
      form.reset();
    } catch (error) {
      console.error("Erreur lors de l'envoi du feedback:", error);
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors de l'envoi. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Envoyez-nous vos commentaires</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de retour</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bug">Signaler un bug</SelectItem>
                    <SelectItem value="idea">Partager une idée</SelectItem>
                    <SelectItem value="suggestion">Faire une suggestion</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Votre message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez votre problème ou suggestion..."
                    className="resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Soyez aussi précis que possible pour nous aider à mieux comprendre.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email ou pseudo (optionnel)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Laissez vos coordonnées si vous souhaitez un retour"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Envoi en cours..." : "Envoyer le feedback"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
