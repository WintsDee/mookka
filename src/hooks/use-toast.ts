
import { useState } from "react";
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
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
    
    // Add to internal state
    const newToast = { title, description, variant, action };
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
