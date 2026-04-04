'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import ResultsTable, { CheckResult } from '@/components/ResultsTable';

export default function Home() {
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (domain: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Minor formatting: remove protocol if user pastes a url
    let formattedDomain = domain.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
    
    // Add default TLD if purely generic word without dot
    if (!formattedDomain.includes('.')) {
      formattedDomain += '.com';
    }

    try {
      const response = await fetch(`/api/check?domain=${encodeURIComponent(formattedDomain)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch pricing. Please try again.');
      }
      
      const data: CheckResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 pb-12 px-6">
      <main className="w-full flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-block bg-brand-primary/10 text-brand-primary font-bold px-4 py-1.5 rounded-full text-sm mb-6 border border-brand-primary/20">
            Ohio Domains MVP
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-brand-text-primary mb-6 leading-tight">
            Find the cheapest <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">domain</span> across providers.
          </h1>
          <p className="text-lg text-brand-text-secondary">
            Search once, compare instantly. We track GoDaddy and Name.com to find you the best registration and renewal prices.
          </p>
        </div>

        {/* Search Component */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {/* Error State */}
        {error && (
          <div className="mt-8 bg-red-50 text-red-600 border border-red-200 px-6 py-4 rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Results Component */}
        <ResultsTable result={result} />
        
      </main>

      {/* Footer */}
      <footer className="mt-auto pt-24 text-center text-sm text-brand-text-secondary/60">
        © {new Date().getFullYear()} Ohio Codespace. Open Source MIT License.
      </footer>
    </div>
  );
}
