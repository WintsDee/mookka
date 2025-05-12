
import { useState } from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  id?: string; // Add the id property to the ToastProps interface
};

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = ({ title, description, variant = "default", action }: ToastProps) => {
    console.log(`Showing toast - title: ${title}, description: ${description}, variant: ${variant}`);
    
    const toastOptions: any = {
      id: Date.now().toString(),
      className: variant === "destructive" ? "destructive" : "",
    };

    if (action) {
      toastOptions.action = action;
    }
    
    // Add to internal state with unique ID for tracking
    const newToast = { 
      title, 
      description, 
      variant, 
      action, 
      id: toastOptions.id 
    };
    setToasts((prev) => [...prev, newToast]);

    // Show the sonner toast
    return sonnerToast(title, {
      description,
      ...toastOptions,
    });
  };

  return {
    toast,
    toasts,
  };
};
