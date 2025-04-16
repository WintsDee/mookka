
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { FeedbackFormValues } from "../feedback-form";

interface TypeFieldProps {
  control: Control<FeedbackFormValues>;
}

export function TypeField({ control }: TypeFieldProps) {
  return (
    <FormField
      control={control}
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
  );
}
