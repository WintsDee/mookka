
import { useState, useEffect, useRef } from 'react';

interface UseHelpFeedbackDialogProps {
  initialTab?: 'help' | 'feedback';
}

export function useHelpFeedbackDialog({ initialTab = 'help' }: UseHelpFeedbackDialogProps) {
  const [activeTab, setActiveTab] = useState<'help' | 'feedback'>(initialTab);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  const resetForm = () => {
    setSubmitted(false);
  };
  
  // Reset the active tab when dialog is opened
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
      setSubmitted(false);
    }
  }, [open, initialTab]);

  // Global event handler for remote dialog activation
  useEffect(() => {
    const handleGlobalClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tabButton = target.closest('[data-tab]');
      
      if (tabButton) {
        const tabName = tabButton.getAttribute('data-tab') as 'help' | 'feedback';
        if (tabName === 'help' || tabName === 'feedback') {
          setActiveTab(tabName);
          setOpen(true);
        }
      }
    };
    
    document.addEventListener('click', handleGlobalClicks);
    return () => document.removeEventListener('click', handleGlobalClicks);
  }, []);

  // Expose a method to allow other components to open this dialog
  useEffect(() => {
    window.openHelpFeedbackDialog = (tab: 'help' | 'feedback') => {
      setActiveTab(tab);
      setOpen(true);
    };
    
    return () => {
      delete window.openHelpFeedbackDialog;
    };
  }, []);

  return {
    activeTab,
    setActiveTab,
    submitted,
    setSubmitted,
    open,
    setOpen,
    triggerRef,
    resetForm,
  };
}
