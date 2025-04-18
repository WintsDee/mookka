
import React from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useHelpFeedbackDialog } from "@/hooks/use-help-feedback-dialog";
import { HelpFeedbackDialog } from "./help-feedback-dialog";

interface HelpFeedbackProps {
  initialTab?: 'help' | 'feedback';
  buttonVariant?: ButtonProps['variant'];
  buttonText?: string;
  buttonIcon?: boolean;
  'data-help-feedback-trigger'?: boolean;
}

export function HelpFeedback({ 
  initialTab = 'help',
  buttonVariant = 'ghost',
  buttonText = 'Aide et Feedback',
  buttonIcon = true,
  'data-help-feedback-trigger': isTrigger
}: HelpFeedbackProps) {
  const isMobile = useIsMobile();
  const {
    activeTab,
    setActiveTab,
    submitted,
    open,
    setOpen,
    triggerRef,
    resetForm,
  } = useHelpFeedbackDialog({ initialTab });
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size="sm" 
          className={`flex items-center gap-1.5 ${
            buttonVariant === 'ghost' ? 'text-muted-foreground hover:text-foreground' : ''
          } ${
            isMobile ? 'text-xs py-1 px-2 h-auto' : ''
          }`}
          data-help-feedback-trigger={isTrigger ? true : undefined}
          ref={triggerRef}
        >
          {buttonIcon && <HelpCircle size={isMobile ? 14 : 16} />}
          <span>{buttonText}</span>
        </Button>
      </DialogTrigger>
      
      <HelpFeedbackDialog
        open={open}
        onOpenChange={setOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        submitted={submitted}
        resetForm={resetForm}
      />
    </Dialog>
  );
}

// Declare a global interface to add the openHelpFeedbackDialog method
declare global {
  interface Window {
    openHelpFeedbackDialog: (tab: 'help' | 'feedback') => void;
  }
}
