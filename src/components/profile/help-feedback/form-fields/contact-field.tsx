
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { FeedbackFormValues } from "@/hooks/use-feedback-form";

interface ContactFieldProps {
  control: Control<FeedbackFormValues>;
}

export function ContactField({ control }: ContactFieldProps) {
  return (
    <FormField
      control={control}
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
  );
}
