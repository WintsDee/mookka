
import React from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TypeField } from "./form-fields/type-field";
import { TitleField, MessageField, ContactField } from "./form-fields";
import { useFeedbackForm } from "@/hooks/use-feedback-form";

interface FeedbackFormProps {
  onSubmitSuccess: () => void;
}

export function FeedbackForm({ onSubmitSuccess }: FeedbackFormProps) {
  const { form, handleSubmit } = useFeedbackForm({ onSubmitSuccess });
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TypeField control={form.control} />
        <TitleField control={form.control} />
        <MessageField control={form.control} />
        <ContactField control={form.control} />
        
        <Button type="submit" className="w-full">
          Envoyer le feedback
        </Button>
      </form>
    </Form>
  );
}
