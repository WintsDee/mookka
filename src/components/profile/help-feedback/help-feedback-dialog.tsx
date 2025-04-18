
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageSquare } from "lucide-react";
import { FeedbackForm } from "./feedback-form";
import { FeedbackSuccess } from "./feedback-success";
import { HelpItems } from "./help-items";

interface HelpFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTab: 'help' | 'feedback';
  setActiveTab: (tab: 'help' | 'feedback') => void;
  submitted: boolean;
  resetForm: () => void;
}

export function HelpFeedbackDialog({ 
  open, 
  onOpenChange,
  activeTab,
  setActiveTab,
  submitted,
  resetForm,
}: HelpFeedbackDialogProps) {
  return (
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
  );
}
