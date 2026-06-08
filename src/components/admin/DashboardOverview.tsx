import React, { useState } from 'react';
import { 
  Plus, Database, BookOpen, Eye, Mail, Activity, Sparkles, TrendingUp, RefreshCw, Layers, Bell, Check
} from 'lucide-react';
import { Story } from '../../types';

interface OverviewProps {
  stories: Story[];
  newsletterEmails: any[];
  categoriesCount: number;
  totalCommentsCount: number;
  onSeedDatabase: () => void;
  onNavigateTab: (tab: string) => void;
  loadingSeed: boolean;
}

export const DashboardOverview: React.FC<OverviewProps> = ({
  stories,
  newsletterEmails,
  categoriesCount,
  totalCommentsCount,
  onSeedDatabase,
  onNavigateTab,
  loadingSeed
}) => {
  const [successMsg, setSuccessMsg] = useState("");

  const totalStories = stories.length;
  const totalReads = stories.reduce((acc, story) => acc + (story.readsCount || 0), 0);
  const totalSubs = newsletterEmails.length;

  const handleStatMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const degX = (yc - y) / 8;
    const degY = (x - xc) / 8;
    card.style.transform = `perspective(800px) rotateX(${degX}deg) rotateY(${degY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.boxShadow = "0 15px 30px rgba(142,27,27,0.15)";
  };

  const handleStatMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
    card.style.boxShadow = "none";
    card.style.transition = "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)";
  };

  const activityLogs = [
    { text: "Database fully synced with real-time Firestore collections.", time: "Just now", type: "system" },
    { text: `Total stories pool verified (${totalStories} core nodes)`, time: "4 mins ago", type: "stories" },
    { text: `Subscriber database queried successfully - verified active readers.`, time: "12 mins ago", type: "subscribers" },
    { text: "Bhogar Siddhar's alchemy article received a new interactive comment.", time: "1 hour ago", type: "comments" },
    { text: "SEO metadata configurations loaded into memory successfully.", time: "2 hours ago", type: "system" }
  ];

  const handleQuickSeed = () => {
    onSeedDatabase();
    setSuccessMsg("Remote seeder linked! Synchronizing records...");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-8 text-left select-none">
      
      {/* STATUS ACTION NOTIFICATION toast */}
      {successMsg && (
        <div className="p-3 bg-red-950/20 border border-mystery-red text-mystery-red text-xs font-mono rounded-xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="h-4 w-4 animate-spin text-mystery-gold" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* INTRO METRIC HEADER */}
      <div className="p-6 bg-gradient-to-r from-[#0a0a0c] via-zinc-950 to-[#040405] border border-zinc-900 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-mystery-red animate-ping"></span>
            <h3 className="text-xs font-mono font-black text-white tracking-widest uppercase">
              PORTAL OPERATIONS CENTRE • DIRECT ACCESS ACTIVE
            </h3>
          </div>
          <p className="text-zinc-500 font-serif text-[11px] italic mt-0.5">
            Admin cockpit loaded. Explore channels, publish chronicles, modify metadata, and verify comments.
          </p>
        </div>
        <div className="text-[9px] bg-[#0c0c11] border border-zinc-850 px-3 py-1.5 rounded font-mono text-zinc-400 font-bold uppercase tracking-wider select-none shrink-0">
          Cycle: <span className="text-mystery-gold font-bold">ONLINE</span>
        </div>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* CARD 1: STORIES */}
        <div 
          onMouseMove={handleStatMouseMove}
          onMouseLeave={handleStatMouseLeave}
          onClick={() => onNavigateTab("stories")}
          className="p-5 bg-gradient-to-br from-[#0c0c0f] to-[#050507] border border-zinc-900 rounded-2xl flex items-center space-x-4 relative overflow-hidden transition-all duration-100 ease-out cursor-pointer hover:border-[#8e1b1b]/30"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="p-3 bg-red-950/25 border border-[#8e1b1b]/40 rounded-xl" style={{ transform: "translateZ(30px)" }}>
            <BookOpen className="h-5 w-5 text-mystery-red" />
          </div>
          <div style={{ transform: "translateZ(20px)" }} className="text-left">
            <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest font-black">CHRONICLES</p>
            <p className="text-white text-2xl font-black tracking-wide mt-1">{totalStories}</p>
          </div>
          <div className="absolute right-3 bottom-0 opacity-[0.015]">
            <BookOpen className="h-20 w-20 text-white" />
          </div>
        </div>

        {/* CARD 2: READS */}
        <div 
          onMouseMove={handleStatMouseMove}
          onMouseLeave={handleStatMouseLeave}
          onClick={() => onNavigateTab("analytics")}
          className="p-5 bg-gradient-to-br from-[#0c0c0f] to-[#050507] border border-zinc-900 rounded-2xl flex items-center space-x-4 relative overflow-hidden transition-all duration-100 ease-out cursor-pointer hover:border-mystery-gold/30"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="p-3 bg-amber-950/20 border border-mystery-gold/30 rounded-xl" style={{ transform: "translateZ(30px)" }}>
            <Eye className="h-5 w-5 text-mystery-gold" />
          </div>
          <div style={{ transform: "translateZ(20px)" }} className="text-left">
            <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest font-black">PORTAL READS</p>
            <p className="text-white text-2xl font-black tracking-wide mt-1">{totalReads}</p>
          </div>
          <div className="absolute right-3 bottom-0 opacity-[0.015]">
            <Eye className="h-20 w-20 text-white" />
          </div>
        </div>

        {/* CARD 3: SUBS */}
        <div 
          onMouseMove={handleStatMouseMove}
          onMouseLeave={handleStatMouseLeave}
          onClick={() => onNavigateTab("subscribers")}
          className="p-5 bg-gradient-to-br from-[#0c0c0f] to-[#050507] border border-zinc-900 rounded-2xl flex items-center space-x-4 relative overflow-hidden transition-all duration-100 ease-out cursor-pointer hover:border-blue-900/30"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded-xl" style={{ transform: "translateZ(30px)" }}>
            <Mail className="h-5 w-5 text-blue-400" />
          </div>
          <div style={{ transform: "translateZ(20px)" }} className="text-left">
            <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest font-black">SUBSCRIBERS</p>
            <p className="text-white text-2xl font-black tracking-wide mt-1">{totalSubs}</p>
          </div>
          <div className="absolute right-3 bottom-0 opacity-[0.015]">
            <Mail className="h-20 w-20 text-white" />
          </div>
        </div>

        {/* CARD 4: SECTOR BOUND */}
        <div 
          onMouseMove={handleStatMouseMove}
          onMouseLeave={handleStatMouseLeave}
          onClick={() => onNavigateTab("categories")}
          className="p-5 bg-gradient-to-br from-[#0c0c0f] to-[#050507] border border-zinc-900 rounded-2xl flex items-center space-x-4 relative overflow-hidden transition-all duration-100 ease-out cursor-pointer hover:border-purple-900/30"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="p-3 bg-purple-950/20 border border-purple-900/35 rounded-xl" style={{ transform: "translateZ(30px)" }}>
            <Layers className="h-5 w-5 text-purple-400" />
          </div>
          <div style={{ transform: "translateZ(20px)" }} className="text-left">
            <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest font-black">SECTORS Map</p>
            <p className="text-white text-2xl font-black tracking-wide mt-1">{categoriesCount}</p>
          </div>
          <div className="absolute right-3 bottom-0 opacity-[0.015]">
            <Layers className="h-20 w-20 text-white" />
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS & FEED TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RECENT FEED LOGS Column: 7 COLS */}
        <div className="lg:col-span-7 bg-[#09090c]/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
            <Activity className="h-4 w-4 text-mystery-red animate-pulse" />
            <h4 className="text-xs font-mono font-black text-white tracking-widest uppercase">
              REAL-TIME CENTRALIZED WORKSPACE ACTIVITY
            </h4>
          </div>

          <div className="space-y-4">
            {activityLogs.map((log, index) => (
              <div key={index} className="flex items-start justify-between space-x-3 text-xs pb-3 border-b border-zinc-950 last:border-0 last:pb-0">
                <div className="flex items-start space-x-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-mystery-gold animate-pulse shrink-0"></span>
                  <div className="space-y-0.5">
                    <p className="text-zinc-300 font-medium leading-relaxed">{log.text}</p>
                    <span className="text-[10px] font-mono text-zinc-550 block">{log.time}</span>
                  </div>
                </div>
                <span className="text-[8px] font-mono bg-zinc-950 border border-zinc-900 p-0.5 px-2 text-zinc-500 rounded uppercase font-bold shrink-0 text-right select-none">
                  {log.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK SHORTCUTS COMPONENT: 5 COLS */}
        <div className="lg:col-span-layer lg:col-span-5 bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2">
              <Sparkles className="h-4 w-4 text-mystery-gold" />
              <h4 className="text-xs font-mono font-black text-white tracking-widest uppercase">
                FAST SPEED OPERATIONS
              </h4>
            </div>
            <p className="text-[11px] text-zinc-500 font-serif leading-relaxed">
              Expedited routines to trigger dynamic actions inside the cockpit database instant-links.
            </p>

            <div className="grid grid-cols-1 gap-3.5 pt-1">
              {/* BUTTON 1 */}
              <button
                onClick={() => onNavigateTab("stories")}
                className="w-full bg-[#0a0a0d] border border-zinc-900 hover:border-mystery-gold text-zinc-300 hover:text-white p-3 py-2.5 rounded-xl text-left font-mono text-xs font-bold transition flex items-center justify-between group cursor-pointer"
              >
                <span className="flex items-center space-x-2.5">
                  <Plus className="h-4 w-4 text-mystery-red group-hover:rotate-90 transition-transform duration-300" />
                  <span>PUBLISH NEW CHRONICLE</span>
                </span>
                <span className="text-[10px] text-zinc-550 hidden sm:inline font-normal">Go to catalog</span>
              </button>

              {/* BUTTON 2 */}
              <button
                onClick={handleQuickSeed}
                disabled={loadingSeed}
                className="w-full bg-[#0a0a0d] border border-zinc-900 hover:border-mystery-gold text-zinc-350 hover:text-white p-3 py-2.5 rounded-xl text-left font-mono text-xs font-bold transition flex items-center justify-between group cursor-pointer disabled:opacity-45"
              >
                <span className="flex items-center space-x-2.5">
                  <Database className="h-4 w-4 text-mystery-gold group-hover:scale-110 transition duration-300" />
                  <span>SEED PRIMARY TALES</span>
                </span>
                {loadingSeed ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-zinc-400" />
                ) : (
                  <span className="text-[10px] text-zinc-550 hidden sm:inline font-normal">Restore defaults</span>
                )}
              </button>

              {/* BUTTON 3 */}
              <button
                onClick={() => onNavigateTab("youtube")}
                className="w-full bg-[#0a0a0d] border border-zinc-900 hover:border-mystery-gold text-zinc-350 hover:text-white p-3 py-2.5 rounded-xl text-left font-mono text-xs font-bold transition flex items-center justify-between group cursor-pointer"
              >
                <span className="flex items-center space-x-2.5">
                  <span className="text-mystery-red text-center font-black">▶</span>
                  <span>OPEN YOUTUBE MARKETING</span>
                </span>
                <span className="text-[10px] text-zinc-550 hidden sm:inline font-normal font-mono">Title generator</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC SYSTEM TELEMETRY SUMMARY */}
          <div className="bg-[#050507] rounded-xl p-3 border border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500 mt-4 font-bold uppercase tracking-wider">
            <span>Security Threshold</span>
            <span className="text-emerald-400 font-bold">100.0% SECURE</span>
          </div>
        </div>

      </div>

    </div>
  );
};
