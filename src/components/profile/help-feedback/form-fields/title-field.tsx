
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { FeedbackFormValues } from "../feedback-form";

interface TitleFieldProps {
  control: Control<FeedbackFormValues>;
}

export function TitleField({ control }: TitleFieldProps) {
  return (
    <FormField
      control={control}
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
  );
}
