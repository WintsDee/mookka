
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavItemProps {
  path: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

export const NavItem = ({ path, icon: Icon, label, isActive }: NavItemProps) => {
  return (
    <>
      <Icon size={22} />
      <span className="text-xs mt-1.5">{label}</span>
    </>
  );
};
