'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (domain: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [domain, setDomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      onSearch(domain.trim());
    }
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit} 
      className="w-full max-w-2xl mx-auto relative group"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-accent rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
      <div className="relative flex items-center bg-white rounded-full border border-brand-border shadow-sm overflow-hidden p-1.5 focus-within:ring-2 focus-within:ring-brand-primary/50 transition-all">
        <div className="pl-4 pr-3 text-brand-text-secondary">
          <Search size={22} className={isLoading ? "animate-pulse text-brand-primary" : ""} />
        </div>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Search for your perfect domain name..."
          className="flex-1 bg-transparent border-none outline-none text-brand-text-primary placeholder:text-brand-text-secondary/60 text-lg py-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !domain.trim()}
          className="bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2.5 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </motion.form>
  );
}
