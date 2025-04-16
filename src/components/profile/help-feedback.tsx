
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, HelpCircle, MessageSquare, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const feedbackSchema = z.object({
  type: z.string({ required_error: "Veuillez sélectionner un type de retour" }),
  message: z.string().min(10, { message: "Votre message doit contenir au moins 10 caractères" }),
  contact: z.string().optional(),
  title: z.string().optional()
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const helpItems = [
  {
    title: "Comment ajouter un média ?",
    content: "Utilisez la recherche pour trouver un média, puis cliquez sur l'icône + pour l'ajouter à votre bibliothèque."
  },
  {
    title: "Créer une collection",
    content: "Allez dans l'onglet Collections et cliquez sur 'Nouvelle collection' pour créer une liste personnalisée."
  },
  {
    title: "Suivre des amis",
    content: "Recherchez des utilisateurs dans l'onglet Social et cliquez sur 'Suivre' pour voir leur activité."
  },
  {
    title: "Problème technique ?",
    content: "Utilisez le formulaire de feedback pour nous signaler tout problème rencontré."
  }
];

export function HelpFeedback() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'help' | 'feedback'>('help');
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: "",
      message: "",
      contact: "",
      title: ""
    }
  });
  
  async function onSubmit(values: FeedbackFormValues) {
    setIsSubmitting(true);
    
    try {
      // Appel de la fonction Supabase Edge pour créer l'issue GitHub
      const { data, error } = await supabase.functions.invoke('github-issue', {
        body: values
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('Feedback envoyé avec succès:', data);
      
      toast({
        title: "Feedback envoyé",
        description: "Merci pour votre retour ! Nous l'examinerons rapidement.",
      });
      
      setSubmitted(true);
      form.reset();
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du feedback:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du feedback. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  function resetForm() {
    setSubmitted(false);
    form.reset();
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-1.5 text-muted-foreground hover:text-foreground ${
            isMobile ? 'text-xs py-1 px-2 h-auto' : ''
          }`}
        >
          <HelpCircle size={isMobile ? 14 : 16} />
          <span>Aide et Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {activeTab === 'help' ? (
              <>
                <HelpCircle size={18} />
                Besoin d'aide ?
              </>
            ) : (
              <>
                <MessageSquare size={18} />
                Envoyez-nous votre feedback
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex space-x-2 mb-4">
          <Button 
            variant={activeTab === 'help' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveTab('help')}
            className="flex-1"
          >
            <HelpCircle size={16} className="mr-1" />
            Aide
          </Button>
          <Button 
            variant={activeTab === 'feedback' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveTab('feedback')}
            className="flex-1"
          >
            <MessageSquare size={16} className="mr-1" />
            Feedback
          </Button>
        </div>
        
        {activeTab === 'help' ? (
          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-4">
              {helpItems.map((item, index) => (
                <div key={index} className="rounded-lg border p-3">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.content}</p>
                </div>
              ))}
              
              <div className="pt-2 pb-4">
                <Alert variant="default" className="bg-muted/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Besoin de plus d'aide ?</AlertTitle>
                  <AlertDescription>
                    Si vous ne trouvez pas la réponse à votre question, n'hésitez pas à nous envoyer un message via l'onglet Feedback.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <>
            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Send className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Merci pour votre feedback !</h3>
                <p className="text-sm text-muted-foreground">
                  Votre message a bien été envoyé. Nous l'examinerons rapidement.
                </p>
                <Button onClick={resetForm} className="mt-4">
                  Envoyer un autre feedback
                </Button>
              </div>
            ) : (
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
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bug">Bug / Problème</SelectItem>
                            <SelectItem value="feature">Idée / Suggestion</SelectItem>
                            <SelectItem value="feedback">Retour général</SelectItem>
                            <SelectItem value="question">Question</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre (optionnel)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Résumé court de votre feedback" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Décrivez votre feedback en détail..." 
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comment vous contacter (optionnel)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Email ou pseudo" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le feedback'}
                  </Button>
                </form>
              </Form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
