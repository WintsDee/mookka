
import React from "react";
import { HelpCard } from "@/components/ui/help-card";

interface HelpItemProps {
  title: string;
  content: string;
}

export function HelpItem({ title, content }: HelpItemProps) {
  return <HelpCard question={title} answer={content} />;
}
