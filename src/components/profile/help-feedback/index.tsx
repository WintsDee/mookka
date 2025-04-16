
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageSquare } from "lucide-react";
import { FeedbackForm } from "./feedback-form";
import { FeedbackSuccess } from "./feedback-success";
import { HelpItems } from "./help-items";
import { helpItems } from "./data";
import { useIsMobile } from "@/hooks/use-mobile";

export function HelpFeedback() {
  const [activeTab, setActiveTab] = useState<'help' | 'feedback'>('help');
  const [submitted, setSubmitted] = useState(false);
  const isMobile = useIsMobile();
  
  function resetForm() {
    setSubmitted(false);
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`flex items-center gap-1.5 text-muted-foreground hover:text-foreground ${
            isMobile ? 'text-xs py-1 px-2 h-auto' : ''
          }`}
        >
          <HelpCircle size={isMobile ? 14 : 16} />
          <span>Aide et Feedback</span>
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
          >
            <HelpCircle size={16} className="mr-1" />
            Aide
          </Button>
          <Button 
            variant={activeTab === 'feedback' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveTab('feedback')}
            className="flex-1"
          >
            <MessageSquare size={16} className="mr-1" />
            Feedback
          </Button>
        </div>
        
        {activeTab === 'help' ? (
          <HelpItems items={helpItems} />
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
