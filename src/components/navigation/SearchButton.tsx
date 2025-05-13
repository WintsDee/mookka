
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SearchButton = () => {
  return (
    <Link to="/recherche" className="relative group">
      <div className="relative bg-gradient-to-tr from-primary/100 via-primary/100 to-accent/100 p-4 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 hover:shadow-primary/25 flex items-center justify-center">
        <Search size={24} className="text-white" strokeWidth={2.5} />
      </div>
    </Link>
  );
};
