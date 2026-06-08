import React from 'react';
import { useApp } from '../context/AppContext';
import { Hero } from '../components/Hero';
import { StoryCard } from '../components/StoryCard';
import { Story } from '../types';
import { 
  Flame, 
  Compass, 
  MapPin, 
  History, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  setActiveTab: (tab: string) => void;
  setSelectedCategory: (cat: string | null) => void;
  onReadStory: (story: Story) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  setActiveTab, 
  setSelectedCategory,
  onReadStory
}) => {
  const { stories, isStoriesLoading } = useApp();

  // Categories helper
  const categories = [
    { id: 'mystery', label: 'Mystery', count: stories.filter(s => s.category === 'mystery').length, desc: 'Unexplained and mysterious phenomena', icon: Compass, bg: 'from-purple-950/40 to-black hover:border-purple-500/40' },
    { id: 'horror', label: 'Horror', count: stories.filter(s => s.category === 'horror').length, desc: 'Spine-chilling paranormal tales', icon: Flame, bg: 'from-red-950/40 to-black hover:border-red-500/40' },
    { id: 'ancient-secrets', label: 'Ancient Secrets', count: stories.filter(s => s.category === 'ancient-secrets').length, desc: 'Mystic codes and esoteric wisdom', icon: MapPin, bg: 'from-amber-950/40 to-black hover:border-mystery-gold/50' },
    { id: 'history', label: 'Lost History', count: stories.filter(s => s.category === 'history').length, desc: 'Buried history and ancient empires', icon: History, bg: 'from-blue-950/40 to-black hover:border-blue-500/40' },
  ];

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setActiveTab('stories');
  };

  const trendingStories = stories.filter(s => s.isTrending).slice(0, 3);
  const latestStories = stories.slice(0, 3);

  return (
    <div className="space-y-16">
      
      {/* IMMERSIVE HERO */}
      <Hero 
        onExploreClick={() => { setSelectedCategory(null); setActiveTab('stories'); }}
        onAiClick={() => setActiveTab('ai-generator')}
      />

      <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-16">
        
        {/* INTERACTIVE POPULAR CATEGORIES */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-zinc-900 pb-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-mystery-gold font-bold">DISCOVERY SUITE</span>
              <h2 className="font-display text-2xl font-black text-white tracking-widest uppercase">
                Explore Categories
              </h2>
            </div>
            <button
              onClick={() => { setSelectedCategory(null); setActiveTab('stories'); }}
              className="flex items-center space-x-1 text-xs text-zinc-500 hover:text-mystery-gold transition-colors font-semibold"
            >
              <span>See All Chronicles</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`cursor-pointer rounded-xl bg-gradient-to-br ${cat.bg} p-6 border border-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3.5 bg-black/60 rounded-xl border border-zinc-800/80 group-hover:border-mystery-gold/30 transition-all">
                      <Icon className="h-5 w-5 text-mystery-gold transition-all" />
                    </div>
                    <span className="text-xl font-mono font-bold text-zinc-650 group-hover:text-mystery-gold transition-colors select-none">
                      {cat.count.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-sm text-zinc-150 group-hover:text-mystery-gold tracking-wide transition-colors">
                    {cat.label}
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1.5 font-serif italic">
                    {cat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* TRENDING STORIES HERO SLIDE SECTION */}
        {trendingStories.length > 0 && (
          <section className="space-y-6 bg-gradient-to-r from-black via-zinc-950/20 to-black p-6 rounded-2xl border border-zinc-900/60 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-mystery-red/5 blur-[90px] rounded-full pointer-events-none" />
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
              <TrendingUp className="h-4 w-4 text-mystery-red animate-pulse" />
              <h2 className="font-display text-lg font-black text-white tracking-widest uppercase">
                Trending Chronicles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isStoriesLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="bg-zinc-950/80 border border-zinc-900 h-64 rounded-xl animate-pulse" />
                ))
              ) : (
                trendingStories.map((story) => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    onReadClick={onReadStory} 
                  />
                ))
              )}
            </div>
          </section>
        )}

        {/* LATEST INVESTIGATIVE UPLOADS */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-zinc-900 pb-3">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-mystery-red font-bold">CASE RELEASES</span>
              <h2 className="font-display text-2xl font-black text-white tracking-widest uppercase">
                Recent Investigations
              </h2>
            </div>
            <button
              onClick={() => { setSelectedCategory(null); setActiveTab('stories'); }}
              className="flex items-center space-x-1 text-xs text-zinc-500 hover:text-mystery-gold transition-colors font-semibold"
            >
              <span>Explore Full Archives</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isStoriesLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-zinc-950/80 border border-zinc-900 h-[450px] rounded-xl animate-pulse" />
              ))
            ) : (
              latestStories.map((story) => (
                <StoryCard 
                  key={story.id} 
                  story={story} 
                  onReadClick={onReadStory} 
                />
              ))
            )}
          </div>
        </section>

        {/* SPECIAL CROWN BANNER: AI STORYTELLER PROMO */}
        <section className="rounded-2xl border border-mystery-gold/20 bg-gradient-to-r from-zinc-950 to-[#0e0e12] p-8 md:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-mystery-red via-mystery-gold to-mystery-red" />
          <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
            <div className="inline-flex items-center space-x-1.5 bg-mystery-gold/10 border border-mystery-gold/30 rounded-full py-1 px-3 text-[9px] font-mono text-mystery-gold font-bold">
              <Sparkles className="h-3 w-3" />
              <span>COOPERATIVE AI ENGINE</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-wide leading-tight">
              Want to co-create your own mystery?
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed font-serif italic">
              Use our advanced AI Storyteller tool to forge customized historical enigmas, ancient secrets, or spine-chilling horror stories instantly.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('ai-generator')}
            className="shrink-0 bg-gradient-to-r from-mystery-red to-mystery-red hover:from-[#bf2121] text-white border border-mystery-gold/15 py-3 px-8 rounded-lg text-xs tracking-widest uppercase font-black transition-all active:scale-95 shadow-md red-glow cursor-pointer"
          >
            Launch AI Storyteller
          </button>
        </section>

      </div>

    </div>
  );
};
