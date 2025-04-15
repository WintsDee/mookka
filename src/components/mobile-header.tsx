import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function MobileHeader({
  title,
  showBackButton = true,
  onBackClick,
  className,
  children
}: MobileHeaderProps) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-md border-b pt-safe',
        className
      )}
    >
      <div className="flex items-center h-16 px-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={handleBackClick}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
        {children}
      </div>
    </header>
  );
}
