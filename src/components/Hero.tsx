import React from 'react';
import { Sparkles, Play, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onExploreClick: () => void;
  onAiClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onAiClick }) => {
  return (
    <div className="relative overflow-hidden min-h-[520px] flex items-center justify-center p-6 border-b border-zinc-900 bg-black">
      
      {/* BACKGROUND GRAPHIC INTERACTION: CLOUD SMOKE & SCARY GRID */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/60 via-black to-black opacity-80" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-mystery-red/10 blur-[130px] rounded-full pointer-events-none" />

      {/* ABSTRACT PARTICLE RIPPLE EFFECTS OVERLAY */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1500&auto=format&fit=crop')] bg-cover bg-center opacity-10 grayscale mix-blend-color-dodge pointer-events-none" />

      {/* INTENSITY MIST LINES */}
      <div className="absolute inset-0 bg-gradient-to-t from-mystery-black via-transparent to-[#050505] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl text-center space-y-6">
        
        {/* PREMIUM BADGE INDICATOR */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-mystery-dark to-black border border-mystery-gold/30 rounded-full py-1.5 px-4 shadow-[0_0_15px_rgba(197,168,106,0.1)] hover:border-mystery-gold/60 transition-all cursor-pointer"
        >
          <span className="flex h-2 w-2 rounded-full bg-mystery-red animate-ping" />
          <span className="text-[10px] font-mono tracking-widest text-mystery-gold uppercase font-bold">
            THE UNTOLD MYSTERY SERIES • ANCIENT CHRONICLES & LEGENDS
          </span>
        </motion.div>

        {/* HERO TITLE HEADINGS */}
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-widest leading-none text-white select-none filter drop-shadow-lg"
          >
            UNVEILING THE <br className="sm:hidden" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-mystery-gold via-white to-mystery-gold">MYSTERY</span> CHRONICLES
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-serif italic text-base sm:text-xl text-zinc-400 font-medium tracking-wide"
          >
            "Ancient legends, forgotten secrets, and spine-chilling historical enigmas"
          </motion.p>
        </div>

        {/* COMPREHENSIVE DESCRIPTION */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xs sm:text-sm text-zinc-500 max-w-2xl mx-auto leading-relaxed font-serif italic"
        >
          An archive of locked vaults beneath medieval temples, lost continents swallowed by ocean waves, advanced alchemical codes of ancient sages, and the unexplained dark mysteries of history. Exploring truth amidst shadow.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4"
        >
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#8e1b1b] to-mystery-crimson border border-mystery-gold/20 hover:border-mystery-gold text-white font-bold text-xs uppercase tracking-widest py-3 px-8 rounded-lg shadow-lg red-glow transition-all active:scale-95 cursor-pointer group"
          >
            <Play className="h-3.5 w-3.5 text-mystery-gold group-hover:scale-110 transition-transform" />
            <span>Read Chronicles</span>
          </button>

          <button
            onClick={onAiClick}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#101014] hover:bg-[#1a1a24] border border-mystery-gold/30 hover:border-mystery-gold text-mystery-gold hover:text-white font-bold text-xs uppercase tracking-widest py-3 px-8 rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Storyteller</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </motion.div>

        {/* TRIPLE SUB BANNER METRICS */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-3 max-w-lg mx-auto pt-10 border-t border-zinc-900 text-center gap-2 text-zinc-640 font-mono text-[9px] uppercase tracking-widest"
        >
          <div className="space-y-1">
            <p className="text-zinc-400 font-bold text-base font-sans tracking-normal">50K+</p>
            <p>ACTIVE READERS</p>
          </div>
          <div className="space-y-1 border-x border-zinc-900">
            <p className="text-zinc-400 font-bold text-base font-sans tracking-normal">100%</p>
            <p>HISTORICAL EVIDENCE</p>
          </div>
          <div className="space-y-1">
            <p className="text-zinc-400 font-bold text-base font-sans tracking-normal">24/7</p>
            <p>AI CO-PILOT</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
