
import { Search } from 'lucide-react';

export const SearchButton = () => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-[#1A1F2C] rounded-full"></div>
      <div className="relative bg-gradient-to-tr from-primary/80 via-primary/60 to-accent/80 p-4 rounded-full shadow-lg">
        <Search size={24} className="text-white" strokeWidth={2.5} />
      </div>
    </div>
  );
};
