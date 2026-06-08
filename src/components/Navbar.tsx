import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Sparkles, 
  Youtube, 
  Info, 
  Mail, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X,
  Bookmark,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { user, isAdmin, loginWithGoogle, logout, bookmarks } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isGuest = !user || user.uid.startsWith('guest_');

  const menuItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'stories', label: 'Stories', icon: BookOpen },
    { id: 'ai-generator', label: 'AI Storyteller', icon: Sparkles },
    { id: 'creator-tools', label: 'Creator Tools', icon: Youtube },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-mystery-gold/15 px-4 lg:px-8 py-3 transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* LOGO SECTION */}
        <div 
          onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} 
          className="flex cursor-pointer items-center space-x-3 group"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-mystery-red to-black border border-mystery-gold/30 gold-glow transition-all duration-300 group-hover:border-mystery-crimson">
            <span className="font-display font-black text-xl text-mystery-gold group-hover:text-white transition-colors">U</span>
            <span className="font-display font-black text-xs text-mystery-red absolute bottom-0.5 right-1">T</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-black tracking-widest text-[#ffffff] group-hover:text-mystery-gold transition-colors duration-300">
              UNKNOWN TAMIZHA
            </h1>
            <p className="text-[10px] font-mono tracking-widest text-mystery-gold/80 group-hover:text-white transition-all">
              THE UNTOLD MYSTERIES
            </p>
          </div>
        </div>

        {/* DESKTOP MENU ITEMS */}
        <div className="hidden lg:flex items-center space-x-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                id={`nav-${item.id}`}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md font-sans text-xs font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'bg-mystery-red/20 text-mystery-gold border-b-2 border-mystery-gold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-mystery-gold' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Admin tab if logged in as administrator */}
          {isAdmin && (
            <button
              id="nav-admin"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-md font-sans text-xs font-bold tracking-wide border border-mystery-red/40 transition-all duration-300 ${
                activeTab === 'admin'
                  ? 'bg-mystery-red text-white gold-glow border-mystery-gold'
                  : 'text-mystery-red hover:text-white hover:bg-mystery-red/10'
              }`}
            >
              <ShieldAlert className="h-3.5 w-3.5 animate-pulse" />
              <span>Admin Panel</span>
            </button>
          )}
        </div>

         {/* USER PROFILE SECTION / GUEST / ADMIN */}
        <div className="hidden lg:flex items-center space-x-3">
          {user && bookmarks.length > 0 && (
            <button 
              onClick={() => setActiveTab('stories')}
              className="relative flex items-center space-x-1 text-zinc-400 hover:text-mystery-gold transition-colors mr-2 text-xs font-semibold py-1 px-2.5 bg-zinc-900/80 rounded-full border border-zinc-800"
            >
              <Bookmark className="h-3.5 w-3.5 text-mystery-gold fill-mystery-gold" />
              <span>Saved</span>
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-mystery-red text-[9px] font-bold text-white">
                {bookmarks.length}
              </span>
            </button>
          )}

          {!isGuest ? (
            <div className="flex items-center space-x-3 pl-3 border-l border-zinc-800">
              <div className="flex items-center space-x-2">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || "Archivist"} 
                    className="h-7 w-7 rounded-full border border-mystery-gold/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-850 border border-zinc-700 text-xs font-bold text-mystery-gold">
                    {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-zinc-350 select-none hidden xl:inline max-w-[120px] truncate leading-tight">
                    {user?.displayName}
                  </span>
                  <span className="text-[8px] tracking-wider uppercase font-bold text-mystery-gold/90 scale-95 origin-left">
                    {user?.email === "kalam172010@gmail.com" ? "SUPREME ARCHIVIST" : "RESEARCH FELLOW"}
                  </span>
                </div>
              </div>
              <button
                id="btn-logout"
                onClick={logout}
                className="flex items-center space-x-1.5 rounded-md border border-zinc-800 hover:border-mystery-red/35 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer bg-zinc-950/40"
              >
                <LogOut className="h-3 w-3 text-zinc-500" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3 pl-3 border-l border-zinc-850">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-500">
                G
              </div>
              <div className="flex flex-col text-left mr-1">
                <span className="text-xs font-medium text-zinc-300 select-none hidden xl:inline">
                  அன்புள்ள வாசகர்
                </span>
                <span className="text-[8px] text-zinc-650 font-mono uppercase tracking-widest scale-95 origin-left">Guest Explorer</span>
              </div>
              <button
                id="btn-login-google"
                onClick={loginWithGoogle}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-mystery-gold to-mystery-gold/85 hover:from-white hover:to-mystery-gold text-black font-display font-black text-xs px-3.5 py-1.5 rounded border border-mystery-gold/50 gold-glow transition-all active:scale-95 cursor-pointer"
              >
                <LogIn className="h-3 w-3 shrink-0" />
                <span>SIGN IN</span>
              </button>
            </div>
          )}
        </div>

        {/* MOBILE MENU TRIGGER */}
        <div className="flex items-center space-x-3 lg:hidden">
          {user && bookmarks.length > 0 && (
            <button 
              onClick={() => setActiveTab('stories')}
              className="relative flex items-center justify-center p-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400"
            >
              <Bookmark className="h-3.5 w-3.5 text-mystery-gold" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-mystery-red text-[8px] font-bold text-white">
                {bookmarks.length}
              </span>
            </button>
          )}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md border border-zinc-800 p-2 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden mt-3 pt-3 border-t border-zinc-800/80 space-y-2 overflow-hidden"
          >
            <div className="flex flex-col space-y-1 pb-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    id={`mobile-nav-${item.id}`}
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                    className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-md text-sm font-medium tracking-wide transition-all ${
                      isActive
                        ? 'bg-mystery-red/10 text-mystery-gold border-l-4 border-mystery-gold'
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 text-zinc-500" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {isAdmin && (
                <button
                  id="mobile-nav-admin"
                  onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                  className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-md text-sm font-bold tracking-wide transition-all ${
                    activeTab === 'admin'
                      ? 'bg-mystery-red/20 text-white border-l-4 border-mystery-gold'
                      : 'text-mystery-red hover:bg-mystery-red/5'
                  }`}
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Admin Panel</span>
                </button>
              )}
            </div>

            {/* Authenticated user row or Login */}
            <div className="pt-3 border-t border-zinc-900 pb-2 flex flex-col space-y-2.5">
              {!isGuest ? (
                <div className="px-4">
                  <div className="flex items-center space-x-3 mb-2.5">
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName || "User"} 
                        className="h-8 w-8 rounded-full border border-mystery-gold/30"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-850 text-xs font-bold text-mystery-gold">
                        {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-white">{user?.displayName}</p>
                      <p className="text-[10px] uppercase font-bold text-mystery-gold tracking-wide">
                        {user?.email === "kalam172010@gmail.com" ? "SUPREME ARCHIVIST" : "RESEARCH FELLOW"}
                      </p>
                      <p className="text-[9px] text-zinc-500">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    id="mobile-btn-logout"
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex w-full items-center justify-center space-x-2 rounded-md border border-[#c13232]/30 py-2 text-xs font-semibold text-zinc-500 hover:text-white transition-all cursor-pointer bg-zinc-950/20"
                  >
                    <LogOut className="h-3.5 w-3.5 text-zinc-500" />
                    <span>Logout Session</span>
                  </button>
                </div>
              ) : (
                <div className="px-4">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-900">
                    <div className="flex items-center space-x-2.5 py-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-850 text-xs font-bold text-zinc-650">
                        G
                      </div>
                      <div className="text-left font-[inherit]">
                        <p className="text-xs font-semibold text-zinc-350">அன்புள்ள வாசகர்</p>
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Guest Explorer</p>
                      </div>
                    </div>
                  </div>
                  <button
                    id="mobile-btn-login"
                    onClick={() => { loginWithGoogle(); setMobileMenuOpen(false); }}
                    className="flex w-full items-center justify-center space-x-2 bg-gradient-to-r from-mystery-gold to-mystery-gold/85 text-black font-display font-black py-2.5 rounded text-xs gold-glow transition-all active:scale-95 cursor-pointer"
                  >
                    <LogIn className="h-3.5 w-3.5 shrink-0" />
                    <span>SIGN IN WITH GOOGLE</span>
                  </button>
                </div>
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
