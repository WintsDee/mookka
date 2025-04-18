
import { Search } from 'lucide-react';

export const SearchButton = () => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/50 via-primary/40 to-accent/50 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>
      <div className="relative bg-gradient-to-tr from-primary/80 via-primary/60 to-accent/80 p-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-primary/25">
        <Search size={24} className="text-white" strokeWidth={2.5} />
      </div>
    </div>
  );
};
