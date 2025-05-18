
import { useNavigate } from "react-router-dom";

interface UseDialogFlowProps {
  onOpenChange: (open: boolean) => void;
}

export function useDialogFlow({ onOpenChange }: UseDialogFlowProps) {
  const navigate = useNavigate();
  
  const closeDialog = () => {
    onOpenChange(false);
  };
  
  const goToLibrary = () => {
    onOpenChange(false);
    navigate('/bibliotheque');
  };
  
  const autoClose = (delay = 1500) => {
    setTimeout(() => {
      onOpenChange(false);
    }, delay);
  };

  return {
    closeDialog,
    goToLibrary,
    autoClose
  };
}
