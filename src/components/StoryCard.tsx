import React from 'react';
import { Story } from '../types';
import { useApp } from '../context/AppContext';
import { Eye, Bookmark, TrendingUp, BookOpen, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface StoryCardProps {
  story: Story;
  onReadClick: (story: Story) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onReadClick }) => {
  const { isBookmarked, toggleBookmark, userProgresses } = useApp();

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'mystery': return 'மர்மம் (Mystery)';
      case 'horror': return 'திகில் (Horror)';
      case 'ancient-secrets': return 'ரகசியங்கள் (Secrets)';
      case 'history': return 'வரலாறு (History)';
      default: return cat;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'mystery': return 'bg-purple-950/40 text-purple-300 border-purple-800/40';
      case 'horror': return 'bg-red-950/40 text-red-300 border-red-800/40';
      case 'ancient-secrets': return 'bg-amber-950/40 text-mystery-gold border-mystery-gold/35';
      case 'history': return 'bg-blue-950/40 text-blue-300 border-blue-800/40';
      default: return 'bg-zinc-900 border-zinc-800 text-zinc-400';
    }
  };

  // Find users reading progress if available
  const progressRecord = userProgresses.find(p => p.storyId === story.id);
  const progressPercent = progressRecord ? progressRecord.scrollPercent : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-[#0d0d10] border border-zinc-800/65 hover:border-mystery-gold/30 hover:shadow-[0_0_30px_rgba(197,_168,_106,_0.05)] transition-all duration-300 min-h-[420px]"
    >
      {/* CARD BODY INCLUDES ZOOMING THUMBNAIL */}
      <div className="relative">
        
        {/* THUMBNAIL CONTAINER */}
        <div className="relative overflow-hidden aspect-video w-full border-b border-zinc-900 bg-zinc-950">
          <img
            src={story.thumbnail || "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=600&auto=format&fit=crop"}
            alt={story.title}
            className="h-full w-full object-cover transform scale-102 group-hover:scale-110 transition-transform duration-700 ease-out brightness-85 group-hover:brightness-100"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-[#0d0d10]/40 to-transparent pointer-events-none" />

          {/* TRENDING BADGE */}
          {story.isTrending && (
            <div className="absolute top-3 left-3 bg-[#8e1b1b] border border-mystery-gold/30 text-white rounded-md px-2 py-0.5 text-[9px] uppercase tracking-widest font-black flex items-center space-x-1 shadow-md">
              <TrendingUp className="h-3 w-3 text-mystery-gold animate-bounce" />
              <span>Trending</span>
            </div>
          )}

          {/* CATEGORY TAG */}
          <div className={`absolute bottom-3 left-3 select-none text-[10px] font-bold tracking-wider capitalize border px-2 py-0.5 rounded-md ${getCategoryColor(story.category)}`}>
            {getCategoryLabel(story.category)}
          </div>

          {/* READ TIME ACCENT */}
          <div className="absolute bottom-3 right-3 select-none bg-black/70 border border-zinc-850 text-zinc-300 backdrop-blur-md rounded-md px-2 py-0.5 text-[9px] font-mono flex items-center space-x-1">
            <Clock className="h-2.5 w-2.5 text-mystery-gold" />
            <span>5 Mins Read</span>
          </div>

          {/* BOOKMARK BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(story.id);
            }}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 border border-zinc-800 hover:border-mystery-gold hover:bg-black/90 text-zinc-300 hover:text-mystery-gold transition-all duration-300 shadow-md group/bookmark"
          >
            <Bookmark 
              className={`h-4 w-4 transition-all duration-300 ${
                isBookmarked(story.id) 
                  ? 'text-mystery-gold fill-mystery-gold' 
                  : 'group-hover/bookmark:scale-110'
              }`} 
            />
          </button>
        </div>

        {/* METADATA WRAPPER */}
        <div className="p-5 flex flex-col space-y-2.5">
          <div className="flex items-center space-x-2 text-[10px] font-semibold text-mystery-gold/90 font-mono tracking-widest uppercase">
            <span>Posted by {story.creatorName || "Unknown Tamizha"}</span>
            <span>•</span>
            <span>{new Date(story.createdAt).toLocaleDateString()}</span>
          </div>

          <h3 className="font-display text-base font-extrabold tracking-wide text-zinc-100 group-hover:text-mystery-gold transition-colors duration-300 leading-snug line-clamp-2">
            {story.title}
          </h3>

          <p className="text-zinc-400 text-xs font-serif italic line-clamp-1">
            {story.subtitle}
          </p>

          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">
            {story.content.replace(/[#*`\-[\]()]/g, '').slice(0, 160)}...
          </p>
        </div>
      </div>

      {/* CARD INTERACTIONS ACTION ROWS */}
      <div className="px-5 pb-5">
        
        {/* Dynamic reading progress visual indicator */}
        {progressPercent > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-1">
              <span className="flex items-center space-x-1">
                <BookOpen className="h-3 w-3 text-mystery-red" />
                <span>Progress:</span>
              </span>
              <span className="font-mono text-mystery-gold">{progressPercent}% read</span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-1 border border-zinc-850 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-mystery-red to-mystery-gold h-1 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-zinc-900/60 w-full">
          <div className="flex items-center space-x-1.5 text-zinc-500 text-[11px] font-mono">
            <Eye className="h-3.5 w-3.5" />
            <span>{story.readsCount || 0} views</span>
          </div>

          <button
            onClick={() => onReadClick(story)}
            className="flex items-center justify-center space-x-1 cursor-pointer bg-gradient-to-r from-[#17171e] to-black hover:from-mystery-red hover:to-mystery-red/80 border border-zinc-800 group-hover:border-mystery-red text-xs font-bold text-zinc-300 hover:text-white py-1.5 px-4 rounded-md transition-all duration-300 active:scale-95"
          >
            <span>Read Mystery</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
