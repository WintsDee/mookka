
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageSquare } from "lucide-react";
import { FeedbackForm } from "./feedback-form";
import { FeedbackSuccess } from "./feedback-success";
import { HelpItems } from "./help-items";
import { useIsMobile } from "@/hooks/use-mobile";
import { ButtonProps } from "@/components/ui/button";

interface HelpFeedbackProps {
  initialTab?: 'help' | 'feedback';
  buttonVariant?: ButtonProps['variant'];
  buttonText?: string;
  buttonIcon?: boolean;
}

export function HelpFeedback({ 
  initialTab = 'help',
  buttonVariant = 'ghost',
  buttonText = 'Aide et Feedback',
  buttonIcon = true 
}: HelpFeedbackProps) {
  const [activeTab, setActiveTab] = useState<'help' | 'feedback'>(initialTab);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  
  function resetForm() {
    setSubmitted(false);
  }
  
  // Effect to set the correct tab when the dialog is opened
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);
  
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
          data-help-feedback-trigger
        >
          {buttonIcon && <HelpCircle size={isMobile ? 14 : 16} />}
          <span>{buttonText}</span>
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
            data-tab="help"
          >
            <HelpCircle size={16} className="mr-1" />
            Aide
          </Button>
          <Button 
            variant={activeTab === 'feedback' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveTab('feedback')}
            className="flex-1"
            data-tab="feedback"
          >
            <MessageSquare size={16} className="mr-1" />
            Feedback
          </Button>
        </div>
        
        {activeTab === 'help' ? (
          <HelpItems />
        ) : (
          <>
            {submitted ? (
              <FeedbackSuccess onReset={resetForm} />
            ) : (
              <FeedbackForm onSubmitSuccess={() => setSubmitted(true)} />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
