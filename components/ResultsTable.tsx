'use client';

import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle2, ShieldCheck, Zap, Info } from 'lucide-react';

export type DomainPrice = {
  registrar: string;
  price: number;
  renewal: number;
  buyLink: string;
  type: 'Live' | 'Estimated';
};

export type CheckResult = {
  domain: string;
  available: boolean;
  prices: DomainPrice[];
  cheapest: string;
};

interface ResultsTableProps {
  result: CheckResult | null;
}

export default function ResultsTable({ result }: ResultsTableProps) {
  if (!result) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full max-w-4xl mx-auto mt-12"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-brand-text-primary flex items-center gap-2">
            {result.available ? (
              <CheckCircle2 className="text-brand-accent" size={28} />
            ) : null}
            {result.domain}
          </h2>
          <p className="text-brand-text-secondary mt-1">
            {result.available 
              ? 'Great news! This domain is available. Compare prices below.' 
              : 'This domain might be taken, but you can still check offers.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.prices.map((price, idx) => {
          const isCheapest = result.cheapest === price.registrar;
          const isLive = price.type === 'Live';

          return (
            <motion.div
              key={price.registrar}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`relative bg-brand-card rounded-2xl p-6 shadow-sm border-2 transition-all hover:shadow-md h-full flex flex-col ${
                isCheapest 
                  ? 'border-brand-accent ring-4 ring-brand-accent/10' 
                  : 'border-brand-border'
              }`}
            >
              {isCheapest && (
                <div className="absolute -top-4 -right-1">
                  <div className="bg-brand-accent text-white text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldCheck size={12} />
                    Best Value
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-brand-text-primary">{price.registrar}</h3>
                  <div className="mt-1 flex gap-2 items-center">
                    {isLive ? (
                      <span className="text-[10px] font-black uppercase text-brand-accent bg-brand-accent/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Zap size={10} strokeWidth={3} />
                        Live
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-brand-text-secondary bg-brand-text-secondary/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Info size={10} strokeWidth={3} />
                        Estimate
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-brand-text-primary">
                    ${price.price.toFixed(2)}
                  </div>
                  <p className="text-brand-text-secondary text-[10px] font-bold uppercase tracking-tight mt-0.5">
                    1st year
                  </p>
                </div>
              </div>

              <div className="bg-brand-background/50 rounded-xl p-3 mb-6 flex justify-between items-center border border-brand-border/30">
                <span className="text-brand-text-secondary font-medium text-xs">Renewal</span>
                <span className="text-brand-text-primary font-bold text-sm">${price.renewal.toFixed(2)}/yr</span>
              </div>

              <div className="mt-auto">
                <a
                  href={price.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-colors ${
                    isCheapest
                      ? 'bg-brand-primary hover:bg-brand-primary/90 text-white'
                      : 'bg-brand-text-primary hover:bg-black text-white'
                  }`}
                >
                  Buy Now
                  <ExternalLink size={14} strokeWidth={2.5} />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

