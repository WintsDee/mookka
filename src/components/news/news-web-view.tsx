
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";

interface WebViewProps {
  url: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WebView: React.FC<WebViewProps> = ({ 
  url, 
  title, 
  isOpen, 
  onClose 
}) => {
  if (!url) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full max-w-full sm:max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b flex-shrink-0 flex flex-row items-center">
          <DialogTitle className="text-lg mr-auto truncate">{title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={20} />
          </Button>
        </DialogHeader>
        
        <div className="flex-grow overflow-hidden">
          <iframe
            src={url}
            title={title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <DialogFooter className="p-4 border-t flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={() => window.open(url, '_blank')}
            className="ml-auto"
          >
            Ouvrir dans le navigateur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
