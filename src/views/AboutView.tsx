import React from 'react';
import { ShieldCheck, Compass, Users2, Award } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutView: React.FC = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-16">
      
      {/* HEADER HERO */}
      <div className="text-center space-y-4">
        <span className="text-[10px] bg-mystery-gold/15 border border-mystery-gold/30 rounded px-2.5 py-1 text-mystery-gold font-mono font-bold tracking-widest uppercase">
          WHO I AM • THE CREATOR
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-widest leading-none">
          UNKNOWN TAMIZHA
        </h1>
        <p className="text-zinc-400 font-serif italic text-base sm:text-lg max-w-2xl mx-auto">
          "Behind every forgotten legend lies a denied, misplaced, or hidden truth waiting to be unveiled..."
        </p>
      </div>

      {/* CORE IDENTITY MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t border-zinc-900 pt-12">
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-white tracking-wider flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-mystery-red" />
            <span>My Mission</span>
          </h2>
          <p className="text-zinc-400 text-xs leading-relaxed font-sans">
            "Unknown Tamizha" is my personal investigative chronicle and historical storytelling portal. Founded on a deep obsession with ancient literature, stone epigraphy, palm-leaf codices, and oral folklore, my work aims to scientifically, logically, and cinematically analyze history's most intriguing enigmas.
          </p>
          <p className="text-zinc-400 text-xs leading-relaxed font-sans">
            Whether deciphering locked subterranean vaults beneath medieval temples, mapping tsunami-sunken prehistoric lands, or replicating the alchemical chemistry of ancient Siddhas, I am dedicated to bridging ancient mysteries with modern scientific rigor, presenting them in a highly engaging, world-class digital medium.
          </p>
        </div>
        
        {/* RIGHT PICTURE GRAPHIC DECORATIVE ROW */}
        <div className="relative rounded-xl overflow-hidden border border-zinc-850 aspect-video bg-zinc-950 shadow-xl group">
          <img
            src="https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?q=80&w=600&auto=format&fit=crop"
            alt="Unknown Tamizha desk"
            className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-mystery-gold font-bold">RESEARCH HEADQUARTERS</span>
          </div>
        </div>
      </div>

      {/* THREE PILLAR PILES */}
      <section className="space-y-6">
        <h2 className="font-display text-lg font-bold text-white text-center tracking-widest uppercase">
          Key Pillars of My Research
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 bg-[#0c0c0f] border border-zinc-850 rounded-xl space-y-3">
            <div className="p-3 bg-[#8e1b1b]/10 border border-[#8e1b1b]/30 w-fit rounded-lg">
              <ShieldCheck className="h-5 w-5 text-mystery-red" />
            </div>
            <h3 className="text-sm font-bold text-zinc-150">Epigraphic & Literary Evidence</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-sans">
              I cross-examine references from ancient classics, stone wall engravings, copper plates, and ancient traveler logs to establish structural and historical accuracy.
            </p>
          </div>

          <div className="p-6 bg-[#0c0c0f] border border-zinc-850 rounded-xl space-y-3">
            <div className="p-3 bg-amber-950/20 border border-mystery-gold/30 w-fit rounded-lg">
              <Compass className="h-5 w-5 text-mystery-gold" />
            </div>
            <h3 className="text-sm font-bold text-zinc-150">On-Site Exploration</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-sans">
              I believe in boots-on-the-ground research. I travel directly to deep forests, dark chambers, and ancient temple ruins to collect primary records and visual assets.
            </p>
          </div>

          <div className="p-6 bg-[#0c0c0f] border border-zinc-850 rounded-xl space-y-3">
            <div className="p-3 bg-blue-950/20 border border-[#1e40af]/30 w-fit rounded-lg">
              <Users2 className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-zinc-150">Expert Consultation</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-sans">
              I corroborate patterns with professional historians, mineralogists, numismatists, and local tribal keepers to ensure scholarly objectivity before publishing.
            </p>
          </div>

        </div>
      </section>

      {/* BOTTOM MILESTONE BANNER */}
      <div className="rounded-xl bg-zinc-950/50 border border-zinc-850 p-6 md:p-8 flex items-center justify-between flex-col md:flex-row gap-6 text-center md:text-left">
        <div className="space-y-1">
          <h4 className="text-white text-base font-bold flex items-center justify-center md:justify-start space-x-1.5 font-sans">
            <Award className="h-4.5 w-4.5 text-mystery-gold" />
            <span>Unknown Tamizha Channel Hub</span>
          </h4>
          <p className="text-zinc-500 text-xs">
            Join a thriving digital community of over 2 Million curious minds on YouTube exploring historical secrets and occult research.
          </p>
        </div>
        <a 
          href="https://youtube.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="shrink-0 bg-[#c4302b] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest py-2.5 px-6 rounded transition-all active:scale-95"
        >
          Subscribe on YouTube
        </a>
      </div>

    </div>
  );
};
