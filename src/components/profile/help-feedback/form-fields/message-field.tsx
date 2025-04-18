
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { FeedbackFormValues } from "@/hooks/use-feedback-form";

interface MessageFieldProps {
  control: Control<FeedbackFormValues>;
}

export function MessageField({ control }: MessageFieldProps) {
  return (
    <FormField
      control={control}
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
  );
}
