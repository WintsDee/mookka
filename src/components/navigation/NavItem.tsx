
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavItemProps {
  path: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

export const NavItem = ({ path, icon: Icon, label, isActive }: NavItemProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Icon 
        size={22} 
        className={`transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
      />
      <span 
        className={`text-xs mt-1.5 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
      >
        {label}
      </span>
    </div>
  );
};
