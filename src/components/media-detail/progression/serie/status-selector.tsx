
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Clock, Check } from "lucide-react";

interface StatusSelectorProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

export function StatusSelector({ currentStatus, onStatusChange }: StatusSelectorProps) {
  return (
    <div className="flex gap-4 mb-4">
      <Button
        size="sm"
        variant={currentStatus === 'to-watch' ? 'default' : 'outline'}
        className={currentStatus === 'to-watch' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
        onClick={() => onStatusChange('to-watch')}
      >
        <Eye className="h-4 w-4 mr-1" />
        À voir
      </Button>
      <Button
        size="sm"
        variant={currentStatus === 'watching' ? 'default' : 'outline'}
        className={currentStatus === 'watching' ? 'bg-purple-500 hover:bg-purple-600' : ''}
        onClick={() => onStatusChange('watching')}
      >
        <Clock className="h-4 w-4 mr-1" />
        En cours
      </Button>
      <Button
        size="sm"
        variant={currentStatus === 'completed' ? 'default' : 'outline'}
        className={currentStatus === 'completed' ? 'bg-green-500 hover:bg-green-600' : ''}
        onClick={() => onStatusChange('completed')}
      >
        <Check className="h-4 w-4 mr-1" />
        Terminé
      </Button>
    </div>
  );
}
