
import React from 'react';
import { Textarea } from "@/components/ui/textarea";

interface ReviewTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

export function ReviewTextarea({ value, onChange }: ReviewTextareaProps) {
  return (
    <Textarea
      placeholder="Partagez vos impressions sur ce média..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[120px] resize-none"
    />
  );
}
