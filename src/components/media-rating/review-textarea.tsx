
import React from "react";
import { Textarea } from "../ui/textarea";

interface ReviewTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

export function ReviewTextarea({ value, onChange, placeholder }: ReviewTextareaProps) {
  return (
    <Textarea
      placeholder={placeholder || "Partagez votre avis..."}
      value={value}
      onChange={onChange}
      className="min-h-[120px] resize-none"
    />
  );
}
