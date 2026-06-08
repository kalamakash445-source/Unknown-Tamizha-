import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Story } from '../types';
import { StoryCard } from '../components/StoryCard';
import { CommentSection } from '../components/CommentSection';
import { 
  Search, 
  Bookmark, 
  Eye, 
  X, 
  BookOpen, 
  Flame, 
  Compass, 
  History, 
  MapPin, 
  Share2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StoriesViewProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  activeStory: Story | null;
  setActiveStory: (story: Story | null) => void;
}

export const StoriesView: React.FC<StoriesViewProps> = ({
  selectedCategory,
  setSelectedCategory,
  activeStory,
  setActiveStory
}) => {
  const { 
    stories, 
    isStoriesLoading, 
    bookmarks, 
    user, 
    incrementStoryReads, 
    saveReadingProgress, 
    toggleBookmark,
    isBookmarked 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showShareNotification, setShowShareNotification] = useState(false);

  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Categories Map helper
  const tabs = [
    { id: null, label: 'All Archives', icon: BookOpen },
    { id: 'mystery', label: 'Mystery', icon: Compass },
    { id: 'horror', label: 'Horror', icon: Flame },
    { id: 'ancient-secrets', label: 'Ancient Secrets', icon: MapPin },
    { id: 'history', label: 'Lost History', icon: History },
  ];

  // Update read occurrences inside database when story initially opened
  useEffect(() => {
    if (activeStory) {
      incrementStoryReads(activeStory.id);
      // Reset reader scroll position if ref matches
      if (readerContainerRef.current) {
        readerContainerRef.current.scrollTop = 0;
      }
    }
  }, [activeStory]);

  // Monitor scrolling to track and register reading progress
  const handleScrollProgress = (e: React.UIEvent<HTMLDivElement>) => {
    if (!activeStory || !user) return;
    
    const container = e.currentTarget;
    const scrollOffset = container.scrollTop;
    const maxScroll = container.scrollHeight - container.clientHeight;
    
    if (maxScroll <= 5) return;
    const percentage = Math.min((scrollOffset / maxScroll) * 100, 100);
    
    // Save state once client reaches meaningful chunks
    if (percentage % 5 === 0 || percentage === 100) {
      saveReadingProgress(activeStory.id, percentage);
    }
  };

  const handleShare = (story: Story) => {
    const shareText = `Explore "${story.title}" on Unknown Tamizha! - ${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
      setShowShareNotification(true);
      setTimeout(() => setShowShareNotification(false), 2000);
    });
  };

  // Processing stories list filter
  const filteredStories = stories.filter((story) => {
    const matchesCategory = selectedCategory ? story.category === selectedCategory : true;
    
    const matchesSearch = searchQuery.trim() 
      ? (
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;

    const matchesSaved = filterSavedOnly 
      ? bookmarks.some(bookmark => bookmark.storyId === story.id)
      : true;

    return matchesCategory && matchesSearch && matchesSaved;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 space-y-8">
      
      {/* HEADER META ROW */}
      <div className="space-y-1">
        <span className="text-[10px] bg-mystery-red/10 border border-mystery-red/35 rounded-md px-2.5 py-0.5 uppercase tracking-widest font-mono text-mystery-gold font-bold">
          ANCIENT CHRONICLES & RECORDS
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-widest uppercase text-white">
          Stories Vault
        </h1>
        <p className="text-zinc-500 text-xs italic font-serif">Explore authentic research files, occult discoveries, and historical lore</p>
      </div>

      {/* FILTER CONTROLS HUB */}
      <div className="space-y-4 bg-zinc-950/40 p-4 border border-zinc-900 rounded-xl">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          
          {/* SEARCH FIELD */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by story titles, themes, or keywords..."
              className="w-full bg-black/60 border border-zinc-805 text-xs text-zinc-200 pl-10 pr-4 py-2.5 rounded-lg outline-none focus:border-mystery-gold/50 focus:shadow-[0_0_15px_rgba(197,_168,_106,_0.05)] transition-all"
            />
          </div>

          {/* BOOKMARK FILTER TOGGLE */}
          <button
            onClick={() => {
              setFilterSavedOnly(!filterSavedOnly);
            }}
            className={`flex items-center space-x-1.5 px-4.5 py-2.5 rounded-lg cursor-pointer text-xs font-semibold tracking-wide border transition-all duration-350 ${
              filterSavedOnly
                ? 'bg-mystery-gold/15 text-mystery-gold border-mystery-gold/40 shadow-sm'
                : 'bg-black/40 text-zinc-400 border-zinc-850 hover:text-white hover:border-zinc-800'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${filterSavedOnly ? 'fill-mystery-gold text-mystery-gold' : ''}`} />
            <span>Saved Chapters ({bookmarks.length})</span>
          </button>

        </div>

        {/* CATEGORY SELECTOR BUTTONS */}
        <div className="flex flex-wrap gap-2 border-t border-zinc-900 pt-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSel = selectedCategory === tab.id;
            return (
              <button
                id={`cat-${tab.id || 'all'}`}
                key={tab.id || 'all'}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center space-x-1.5 py-1.5 px-3.5 rounded-full text-xs font-semibold transition-all ${
                  isSel
                    ? 'bg-mystery-red text-white border border-mystery-gold/20'
                    : 'bg-[#111115] hover:bg-zinc-900 border border-zinc-850 text-zinc-450 hover:text-zinc-200'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CORE STORIES GRID VIEW */}
      <div>
        {isStoriesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-[#0c0c0f] border border-zinc-900 h-96 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="text-center py-24 space-y-4 p-8 border border-zinc-900 rounded-xl bg-zinc-950/20">
            <BookOpen className="h-10 w-10 text-zinc-750 mx-auto" />
            <p className="text-zinc-500 font-serif italic text-sm">
              No matching investigative records or chronicles found.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setSelectedCategory(null); setFilterSavedOnly(false); }}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-mystery-gold py-1.5 px-4 rounded-md transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onReadClick={setActiveStory}
              />
            ))}
          </div>
        )}
      </div>

      {/* DETAILED READER OVERLAY MODAL */}
      <AnimatePresence>
        {activeStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative flex h-full w-full max-w-2xl flex-col bg-mystery-black border-l border-zinc-850 shadow-2xl z-50 font-sans"
            >
              
              {/* TOP HEADER CONTROLS BAR */}
              <div className="flex items-center justify-between border-b border-zinc-850 px-6 py-4 bg-zinc-950/90 backdrop-blur-md">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] tracking-widest text-mystery-gold font-bold font-mono uppercase bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    File #{activeStory.id.slice(0, 8)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  
                  {/* FONT SIZE CONTROLLER */}
                  <div className="flex items-center space-x-1.5 bg-black/60 rounded-md p-1 border border-zinc-850">
                    <button
                      onClick={() => setFontSize('sm')}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${fontSize === 'sm' ? 'bg-[#8e1b1b] text-white' : 'text-zinc-500 hover:text-white'}`}
                      title="Small Text"
                    >
                      A
                    </button>
                    <button
                      onClick={() => setFontSize('md')}
                      className={`text-xs font-bold px-2 py-1 rounded transition-all ${fontSize === 'md' ? 'bg-[#8e1b1b] text-white' : 'text-zinc-500 hover:text-white'}`}
                      title="Medium Text"
                    >
                      A
                    </button>
                    <button
                      onClick={() => setFontSize('lg')}
                      className={`text-sm font-bold px-2.5 py-0.5 rounded transition-all ${fontSize === 'lg' ? 'bg-[#8e1b1b] text-white' : 'text-zinc-500 hover:text-white'}`}
                      title="Large Text"
                    >
                      A+
                    </button>
                  </div>

                  {/* ACTIVE BOOKMARK IN DRAWER */}
                  <button
                    onClick={() => toggleBookmark(activeStory.id)}
                    className="p-2 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-mystery-gold hover:border-mystery-gold/40 transition-all cursor-pointer"
                    title={isBookmarked(activeStory.id) ? "Bookmarked" : "Save Story"}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked(activeStory.id) ? 'fill-mystery-gold text-mystery-gold' : ''}`} />
                  </button>

                  {/* ACTIVE SHARE BUTTON */}
                  <button
                    onClick={() => handleShare(activeStory)}
                    className="p-2 rounded bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
                    title="Share Link"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setActiveStory(null)}
                    className="p-2 rounded bg-zinc-900 hover:bg-[#8e1b1b] border border-zinc-850 text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* DUSTY PARCHMENT WRITTEN CONTENT BOX */}
              <div 
                ref={readerContainerRef}
                onScroll={handleScrollProgress}
                className="flex-1 overflow-y-auto px-6 py-6 md:px-10 container-box"
              >
                
                {/* HERO THUMBNAIL COVER */}
                {activeStory.thumbnail && (
                  <div className="w-full aspect-video rounded-xl overflow-hidden border border-zinc-900 mb-6 bg-zinc-950 shadow-md">
                    <img 
                      src={activeStory.thumbnail} 
                      alt={activeStory.title} 
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* ESSENTIAL ARTICLE METADATA */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-1.5 text-xs text-mystery-gold uppercase tracking-widest font-mono">
                    <span className="capitalize">{activeStory.category === "ancient-secrets" ? "Ancient Secrets" : activeStory.category === "history" ? "Lost History" : activeStory.category} File</span>
                    <span>•</span>
                    <span>By {activeStory.creatorName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Eye className="h-3.5 w-3.5" /> {activeStory.readsCount} reads</span>
                  </div>

                  <h2 className="font-display text-2xl md:text-3xl font-black text-white leading-tight tracking-wider">
                    {activeStory.title}
                  </h2>

                  {activeStory.subtitle && (
                    <p className="text-zinc-500 font-serif italic text-sm md:text-base border-l-2 border-[#8e1b1b] pl-3">
                      {activeStory.subtitle}
                    </p>
                  )}
                </div>

                <div className="h-px bg-zinc-900 my-6" />

                {/* BODY CONTENT RENDERING TYPE SET */}
                <div 
                  className={`prose prose-invert max-w-none text-zinc-300 leading-relaxed font-sans select-text whitespace-pre-wrap ${
                    fontSize === 'sm' ? 'text-xs' : fontSize === 'md' ? 'text-sm' : 'text-base md:text-lg'
                  }`}
                >
                  {activeStory.content}
                </div>

                {/* REAL INTEGRATION: REAL LIVE COMMENTS */}
                <CommentSection storyId={activeStory.id} />

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION ON SHARE */}
      <AnimatePresence>
        {showShareNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0d0d10] border border-mystery-gold/30 text-white rounded-lg p-3 shadow-2xl flex items-center space-x-2"
          >
            <Check className="h-4 w-4 text-green-500 bg-green-500/10 p-0.5 rounded-full" />
            <span className="text-xs font-semibold">Share link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
