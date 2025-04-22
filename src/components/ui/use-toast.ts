
import { toast as sonnerToast } from "sonner";
import { useToast as useHookToast } from "@/hooks/use-toast";

// Re-export the toast function from sonner
export const toast = sonnerToast;

// Re-export the useToast hook from our local hooks
export const useToast = useHookToast;
