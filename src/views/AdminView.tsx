import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Story, Comment } from '../types';
import { 
  Activity, BookOpen, Layers, Mail, Video, Settings, ShieldAlert, TrendingUp, Check, RefreshCw, X, Search,
  Download, Flame, Clock, Sparkles, ChevronRight, Lock, Unlock, Radio, Plus, MessageSquare, Menu, Bell, Copy, Save, FileDown, Eye, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { doc, getDocs, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend 
} from 'recharts';

import { DashboardOverview } from '../components/admin/DashboardOverview';
import { YoutubeTools } from '../components/admin/YoutubeTools';
import { MediaLibrary } from '../components/admin/MediaLibrary';
import { SettingsPanel } from '../components/admin/SettingsPanel';
import { CategoryManager, CustomCategory } from '../components/admin/CategoryManager';

export const AdminView: React.FC = () => {
  const { 
    stories, 
    addStory, 
    updateStory, 
    deleteStory, 
    seedDatabase, 
    newsletterEmails,
    user
  } = useApp();

  const isGuest = !user || user.uid.startsWith('guest_');

  // Navigation tab control
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Live Digital Clock
  const [currentTime, setCurrentTime] = useState(new Date().toISOString());

  // Notification menu state
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n1', text: "Welcome to the Unknown Tamizha Executive Cockpit", read: false, time: "Now" },
    { id: 'n2', text: "Database synchronization initialized successfully.", read: false, time: "5 mins ago" },
    { id: 'n3', text: "Visitor telemetry matches search indexes.", read: true, time: "1 hour ago" }
  ]);

  // Interactive Form State (Draft & Publish)
  const [editMode, setEditMode] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState<string>("mystery");
  const [content, setContent] = useState("");
  const [isTrending, setIsTrending] = useState(false);
  const [publishStatus, setPublishStatus] = useState<"published" | "draft">("published");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [autoSaveActive, setAutoSaveActive] = useState(false);

  // Search & Filters State
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [storySearch, setStorySearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Checkbox state for multi-selection deletion
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>([]);

  // Custom Category Integration
  const [customCategoriesList, setCustomCategoriesList] = useState<CustomCategory[]>([]);

  // Simulation comments database
  const [comments, setComments] = useState<any[]>([
    { id: 'c1', commenter: 'கதிர்வேல் பாண்டியன்', text: 'குமரிகண்டம் பற்றிய ஆய்வு மிக அற்புதம்! எங்கள் மூதாதையர் பெருமை பேசுகிறது.', storyTitle: 'The Lost Continent of Kumari Kandam', approved: true, time: '2 mins ago' },
    { id: 'c2', commenter: 'Arun Selvan', text: 'சித்தர்களின் அலைபேசி மற்றும் உலோக விஞ்ஞானம் ஆச்சர்யம் தருகிறது. நற்பணி தொடர வாழ்த்துக்கள்.', storyTitle: 'Mysterious Siddhar Alchemy', approved: false, time: '20 mins ago' },
    { id: 'c3', commenter: 'Meera Devi', text: ' can you write about Tanushkodi night mystery? heard eerie sounds and footprints there.', storyTitle: 'Haunted Tanushkodi Spectres', approved: true, time: '1 hour ago' }
  ]);

  const [commentsFilter, setCommentsFilter] = useState<"all" | "pending" | "approved">("all");

  // Tick the live digital clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch actual comments from Firestore if possible, fallback to initial items
  useEffect(() => {
    const loadComments = async () => {
      try {
        const snap = await getDocs(collection(db, 'comments'));
        const list: any[] = [];
        snap.forEach(docSnap => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (list.length > 0) {
          // Map to fit nicely or merge
          setComments(prev => {
            const firestoreComments = list.map(c => ({
              id: c.id,
              commenter: c.userName || "Secret Reader",
              text: c.commentText,
              storyTitle: "Portal Speculation",
              approved: true, // Auto pre-approved from live
              time: "Synced Live"
            }));
            return [...firestoreComments, ...prev.filter(p => !p.id.startsWith('c'))];
          });
        }
      } catch (err) {
        console.warn("Firestore comments loader fallback inactive", err);
      }
    };
    loadComments();
  }, [stories]);

  // Load Saved Draft on Init on the form
  useEffect(() => {
    const savedTitle = localStorage.getItem('unknown_tamizha_draft_title');
    const savedSubtitle = localStorage.getItem('unknown_tamizha_draft_subtitle');
    const savedThumbnail = localStorage.getItem('unknown_tamizha_draft_thumbnail');
    const savedCategory = localStorage.getItem('unknown_tamizha_draft_category');
    const savedContent = localStorage.getItem('unknown_tamizha_draft_content');
    
    if (savedContent && !editMode) {
      setTitle(savedTitle || "");
      setSubtitle(savedSubtitle || "");
      setThumbnail(savedThumbnail || "");
      setCategory(savedCategory || "mystery");
      setContent(savedContent || "");
      setIsTrending(localStorage.getItem('unknown_tamizha_draft_trending') === 'true');
    }
  }, []);

  // Auto-Save Mechanism
  useEffect(() => {
    if (!title && !content) return;
    const saveTimer = setTimeout(() => {
      if (editMode) return; // Don't auto-save draft if we are editing an existing item online
      setAutoSaveActive(true);
      localStorage.setItem('unknown_tamizha_draft_title', title);
      localStorage.setItem('unknown_tamizha_draft_subtitle', subtitle);
      localStorage.setItem('unknown_tamizha_draft_thumbnail', thumbnail);
      localStorage.setItem('unknown_tamizha_draft_category', category);
      localStorage.setItem('unknown_tamizha_draft_content', content);
      localStorage.setItem('unknown_tamizha_draft_trending', String(isTrending));
      
      const newNotif = {
        id: `auto-${Date.now()}`,
        text: `Draft auto-saved successfully in local storage.`,
        read: false,
        time: "Just now"
      };
      setNotifications(prev => [newNotif, ...prev.slice(0, 5)]);

      setTimeout(() => setAutoSaveActive(false), 2500);
    }, 15000); // Auto save every 15 seconds

    return () => clearTimeout(saveTimer);
  }, [title, subtitle, thumbnail, category, content, isTrending, editMode]);

  const handleClearForm = () => {
    setEditMode(null);
    setTitle("");
    setSubtitle("");
    setThumbnail("");
    setCategory("mystery");
    setContent("");
    setIsTrending(false);
    setPublishStatus("published");
    
    // Clear draft values
    localStorage.removeItem('unknown_tamizha_draft_title');
    localStorage.removeItem('unknown_tamizha_draft_subtitle');
    localStorage.removeItem('unknown_tamizha_draft_thumbnail');
    localStorage.removeItem('unknown_tamizha_draft_category');
    localStorage.removeItem('unknown_tamizha_draft_content');
    localStorage.removeItem('unknown_tamizha_draft_trending');
  };

  const handleEditInit = (story: Story) => {
    setEditMode(story.id);
    setTitle(story.title);
    setSubtitle(story.subtitle || "");
    setThumbnail(story.thumbnail || "");
    setCategory(story.category);
    setContent(story.content);
    setIsTrending(story.isTrending || false);
    setPublishStatus("published");
    
    // Focus or scroll
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || loading) return;

    setLoading(true);
    setSuccessMsg("");

    try {
      if (editMode) {
        await updateStory(editMode, {
          title: title.trim(),
          subtitle: subtitle.trim(),
          thumbnail: thumbnail.trim(),
          category: category as any,
          content: content.trim(),
          isTrending
        });
        setSuccessMsg(`Chronicle "${title.slice(0, 20)}..." updated successfully inside Cloud Firestore!`);
      } else {
        await addStory({
          title: title.trim(),
          subtitle: subtitle.trim(),
          thumbnail: thumbnail.trim(),
          category: category as any,
          content: content.trim(),
          isTrending,
          readsCount: 0,
          creatorName: "Unknown Tamizha",
          createdAt: new Date().toISOString()
        });
        setSuccessMsg(`New chronicle node: "${title.slice(0, 20)}..." has been published!`);
      }
      handleClearForm();
      setTimeout(() => setSuccessMsg(""), 4500);
    } catch (err) {
      console.error(err);
      setSuccessMsg("Write rejected by database. Validate indexes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Permanently remove chronic: "${name}"? This will disconnect it from Firestore collections.`)) {
      setLoading(true);
      try {
        await deleteStory(id);
        setSuccessMsg(`Archival story index dropped: "${name.slice(0, 15)}..."`);
        setSelectedStoryIds(prev => prev.filter(itemId => itemId !== id));
        setTimeout(() => setSuccessMsg(""), 3500);
      } catch (err) {
        console.error(err);
        setSuccessMsg("Error dropping document index.");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleSelectStory = (id: string) => {
    setSelectedStoryIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllStories = () => {
    const visibleIds = filteredStoriesList.map(s => s.id);
    const allSelected = visibleIds.every(id => selectedStoryIds.includes(id));
    if (allSelected) {
      setSelectedStoryIds(prev => prev.filter(id => !visibleIds.includes(id)));
    } else {
      setSelectedStoryIds(prev => {
        const next = [...prev];
        visibleIds.forEach(id => {
          if (!next.includes(id)) {
            next.push(id);
          }
        });
        return next;
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStoryIds.length === 0) return;
    if (window.confirm(`Are you absolutely sure you want to permanently purge ${selectedStoryIds.length} selected chronicle(s) from the archive database? This action is irreversible.`)) {
      setLoading(true);
      try {
        let count = 0;
        for (const id of selectedStoryIds) {
          await deleteStory(id);
          count++;
        }
        setSuccessMsg(`Successfully purged ${count} chronicle(s) from database index.`);
        setSelectedStoryIds([]);
        setTimeout(() => setSuccessMsg(""), 4500);
      } catch (err) {
        console.error(err);
        setSuccessMsg("Error encountered during batch deletion operations.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSeedDatabase = async () => {
    setLoading(true);
    try {
      await seedDatabase();
      setSuccessMsg("Failsafe activated. Default Tamil mystery archives populated successfully!");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      console.error(err);
      setSuccessMsg("Seeder script abort. Try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  // Comments Management Utilities
  const handleApproveComment = (id: string) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, approved: true } : c));
    setNotifications(prev => [{
      id: `ap-${Date.now()}`,
      text: "Authorized an interactive comment for social feeds.",
      read: false,
      time: "Just now"
    }, ...prev]);
  };

  const handleDeleteComment = async (id: string) => {
    if (window.confirm("Permanently erase this comment document?")) {
      setComments(prev => prev.filter(c => c.id !== id));
      try {
        // Try deleting from cloud if authentic id is passed
        await deleteDoc(doc(db, 'comments', id));
      } catch (e) {
        // Safe skip fallback
      }
      setSuccessMsg("Erased comments node successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (window.confirm(`Expel subscriber "${email}" from mailing list?`)) {
      try {
        await deleteDoc(doc(db, 'newsletter', id));
        setSuccessMsg(`Expelled subscriber: ${email}`);
        setTimeout(() => setSuccessMsg(""), 3000);
      } catch (e) {
        setSuccessMsg(`Locally expelled subscriber.`);
      }
    }
  };

  const handleExportCSV = () => {
    if (newsletterEmails.length === 0) return;
    const contentCSV = "data:text/csv;charset=utf-8,ID,Email Address,Signed_Up_At\n" + 
      newsletterEmails.map(sub => `${sub.id},${sub.email},${sub.createdAt}`).join("\n");
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodeURI(contentCSV));
    downloadAnchor.setAttribute("download", `subscribers_list_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Injector shortcuts for Markdown textarea editor
  const injectMarkdown = (wrapperStart: string, wrapperEnd: string = "") => {
    const textarea = document.getElementById("chronic-lore-editor") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const replacement = wrapperStart + (selected || "writeHere") + wrapperEnd;
    setContent(text.substring(0, start) + replacement + text.substring(end));
    
    // Return focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + wrapperStart.length, start + wrapperStart.length + (selected || "writeHere").length);
    }, 100);
  };

  // Parser for Live Mobile Frame
  const parsePreviewMarkdown = (text: string) => {
    if (!text) return <p className="text-zinc-650 text-[10px] italic">Begin typing on the left to review responsive mobile layout configs...</p>;
    const paragraphChunks = text.split("\n");
    return paragraphChunks.map((para, idx) => {
      const line = para.trim();
      if (line.startsWith("###")) {
        return <h4 key={idx} className="text-sm font-bold text-mystery-gold mt-4 mb-2">{line.replace("###", "").trim()}</h4>;
      }
      if (line.startsWith("##")) {
        return <h3 key={idx} className="text-base font-black text-white mt-5 mb-2.5">{line.replace("##", "").trim()}</h3>;
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={idx} className="text-xs font-bold text-zinc-200 my-2">{line.replace(/\*\*/g, "").trim()}</p>;
      }
      return <p key={idx} className="text-[11px] text-zinc-400 font-serif leading-relaxed mb-3">{line}</p>;
    });
  };

  // Filter computation sets
  const filteredStoriesList = stories.filter(st => {
    const matchesSearch = st.title.toLowerCase().includes(storySearch.toLowerCase()) || 
                          st.subtitle?.toLowerCase().includes(storySearch.toLowerCase()) ||
                          st.category.toLowerCase().includes(storySearch.toLowerCase());
    const matchesCategory = selectedCategoryFilter === "all" || st.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredSubsList = newsletterEmails.filter(sub => 
    sub.email.toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  const filteredCommentsList = comments.filter(c => {
    if (commentsFilter === "pending") return !c.approved;
    if (commentsFilter === "approved") return c.approved;
    return true;
  });

  // Recharts high fidelity datasets
  const chartStoriesData = stories.slice(0, 6).map(s => ({
    name: s.title.slice(0, 15) + "...",
    reads: s.readsCount || 40,
    subscribers: Math.floor((s.readsCount || 40) * 0.15)
  }));

  const visitorAnalyticsData = [
    { name: 'Monday', viewers: 120, conversions: 18 },
    { name: 'Tuesday', viewers: 240, conversions: 32 },
    { name: 'Wednesday', viewers: 190, conversions: 15 },
    { name: 'Thursday', viewers: 450, conversions: 80 },
    { name: 'Friday', viewers: 310, conversions: 45 },
    { name: 'Saturday', viewers: 620, conversions: 110 },
    { name: 'Sunday', viewers: 580, conversions: 95 }
  ];

  const categoryPieData = [
    { name: 'Mystery', value: stories.filter(s => s.category === 'mystery').length || 5 },
    { name: 'Horror', value: stories.filter(s => s.category === 'horror').length || 3 },
    { name: 'Historical', value: stories.filter(s => s.category === 'history').length || 4 },
    { name: 'Tamil Secrets', value: stories.filter(s => s.category === 'ancient-secrets').length || 6 }
  ];

  const PIE_COLORS = ['#d4af37', '#8e1b1b', '#3b82f6', '#a855f7'];

  // Sidebar Links Structure
  const sidebarLinks = [
    { id: 'dashboard', label: 'OPERATIONS DESK', icon: Activity },
    { id: 'stories', label: 'STORIES CATALOG', icon: BookOpen },
    { id: 'categories', label: 'GENRE SECTORS', icon: Layers },
    { id: 'media', label: 'MEDIA ARCHIVE', icon: Video },
    { id: 'youtube', label: 'YOUTUBE MARKETING', icon: Video, marker: 'HOT' },
    { id: 'comments', label: 'COMMENTS AUDIT', icon: MessageSquare, badge: comments.filter(c => !c.approved).length },
    { id: 'analytics', label: 'COCKPIT METRICS', icon: TrendingUp },
    { id: 'settings', label: 'SYSTEM UTILITIES', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex relative selection:bg-mystery-red selection:text-white">
      
      {/* 1. LEFT SIDEBAR NAVIGATION: Glassmorphism */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#07070a]/95 backdrop-blur-md border-r border-zinc-900 z-50 transition-transform duration-300 flex flex-col justify-between ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex-1 flex flex-col py-6">
          {/* Logo Brand Header */}
          <div className="px-6 pb-6 border-b border-zinc-950 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Pilot" 
                  className="h-7 w-7 rounded-full border border-mystery-gold/50"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-mystery-gold via-mystery-red to-black border border-mystery-gold/60 flex items-center justify-center font-bold text-xs text-black">
                  உ
                </div>
              )}
              <div className="text-left">
                <h2 className="font-display font-black text-[10px] sm:text-xs text-white tracking-widest uppercase leading-none truncate max-w-[120px]">
                  {isGuest ? "UT GUEST" : (user?.displayName || "UT RESEARCHER")}
                </h2>
                <span className="text-[8px] font-mono text-mystery-gold font-bold uppercase tracking-wider block mt-1.5 leading-none">
                  {isGuest ? "Anonymous Cockpit" : (user?.email === "kalam172010@gmail.com" ? "SUPREME ADMIN ROOT" : "RESEARCH CLEARED")}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-zinc-500 hover:text-white cursor-pointer px-1 rounded bg-zinc-950 border border-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Links List */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-left border ${
                    isActive 
                      ? 'bg-[#8e1b1b]/10 border-mystery-gold/40 text-white shadow-md' 
                      : 'border-transparent text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/40 hover:border-zinc-950'
                  }`}
                >
                  <span className="flex items-center space-x-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-mystery-red animate-pulse' : 'text-zinc-600'}`} />
                    <span>{link.label}</span>
                  </span>
                  
                  {/* Decorative badge markers */}
                  {link.marker && (
                    <span className="text-[8px] bg-mystery-gold text-black font-black p-0.5 px-1.5 rounded animate-pulse">
                      {link.marker}
                    </span>
                  )}
                  {link.badge && link.badge > 0 ? (
                    <span className="text-[8px] bg-mystery-red text-white font-black p-0.5 px-2 rounded-full">
                      {link.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System telemetry footer */}
        <div className="p-4 px-6 border-t border-zinc-950 text-[10px] font-mono text-zinc-650 space-y-1 text-left">
          <p className="flex items-center space-x-2 text-mystery-gold">
            <ShieldAlert className="h-3 w-3" />
            <span className="font-bold">ADMIN RIGHTS ACTIVE</span>
          </p>
          <p className="font-serif">No credentials gate active.</p>
        </div>
      </aside>

      {/* MOBILE DRAW SHIELD OVERLAY */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
        />
      )}

      {/* 2. CHIEF CONTAINER WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR NAVIGATION */}
        <header className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-zinc-900 h-16 px-4 sm:px-8 z-30 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-zinc-950 border border-zinc-900 hover:text-white"
            >
              <Menu className="h-4 w-4 text-zinc-400" />
            </button>
            
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-mono text-zinc-550 uppercase tracking-widest font-black leading-none">ROOT / CORE /</span>
              <h1 className="font-display font-black text-xs sm:text-sm text-zinc-200 tracking-widest uppercase mt-1">
                {sidebarLinks.find(s => s.id === activeTab)?.label}
              </h1>
            </div>
          </div>

          {/* TELEMETRY HEADS-UP ELEMENTS */}
          <div className="flex items-center space-x-4">
            
            {/* UTC LIVE WATCH */}
            <div className="hidden sm:flex items-center space-x-2 bg-[#060608] border border-zinc-900 rounded-lg p-2 py-1.5 font-mono text-[10px] text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-mystery-gold animate-spin-slow" />
              <span>{currentTime.substring(11, 19)} UTC</span>
            </div>

            {/* NOTIFICATIONS BELL */}
            <div className="relative">
              <button 
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-900 hover:text-white relative cursor-pointer active:scale-95 transition"
              >
                <Bell className="h-3.5 w-3.5 text-zinc-400" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-mystery-red animate-ping" />
                )}
              </button>

              <AnimatePresence>
                {notifMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-72 bg-zinc-950 border border-zinc-900 p-3 rounded-2xl shadow-xl z-50 text-left space-y-2.5"
                  >
                    <p className="text-[10px] font-mono bg-zinc-900 p-1 px-2.5 rounded text-zinc-400 font-bold uppercase tracking-wider flex justify-between items-center select-none">
                      <span>CONSOLE FEED LOG</span>
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setNotifMenuOpen(false)} />
                    </p>
                    <div className="space-y-2 max-h-56 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="p-2 bg-black border border-zinc-900 rounded-lg text-[10px] space-y-1">
                          <p className="text-zinc-300 font-medium leading-normal">{n.text}</p>
                          <span className="text-[8px] font-mono text-zinc-550 block">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ADMIN PROFILE COVER */}
            <div className="flex items-center space-x-2.5 border-l border-zinc-900 pl-3.5 select-none">
              <div className="h-8 w-8 rounded-full bg-zinc-900 border border-[#8e1b1b] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" 
                  alt="Admin Avatar" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="hidden md:block text-left leading-none">
                <p className="text-[10px] font-bold text-zinc-100 uppercase tracking-wide">U. TAMIZHA</p>
                <span className="text-[8px] font-mono text-mystery-gold leading-none font-bold uppercase">PROV PANEL</span>
              </div>
            </div>

          </div>
        </header>

        {/* MAIN VIEWER CONTAINER */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-[#030304]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* BRAND SUCCESS MSG */}
              {successMsg && (
                <div className="p-3 bg-red-950/20 border border-[#8e1b1b]/45 text-mystery-red text-xs font-mono rounded-xl mb-6">
                  ✦ {successMsg}
                </div>
              )}

              {/* ROUTE RESOLUTION BLOCKS */}

              {/* SUB TAB: OVERVIEW */}
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  stories={stories}
                  newsletterEmails={newsletterEmails}
                  categoriesCount={customCategoriesList.length || 4}
                  totalCommentsCount={comments.length}
                  onSeedDatabase={handleSeedDatabase}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  loadingSeed={loading}
                />
              )}

              {/* SUB TAB: STORIES CATALOG */}
              {activeTab === 'stories' && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start text-left">
                  
                  {/* WORKSPACE FORM COMPOSER: 7 COLS */}
                  <div className="xl:col-span-8 bg-[#0b0b0e] border border-zinc-900 rounded-2xl p-6 space-y-6">
                    
                    {/* EDIT DRAFT BUBBLE */}
                    {editMode && (
                      <div className="p-3 bg-mystery-gold/10 border border-mystery-gold/20 rounded-xl flex items-center justify-between text-xs text-mystery-gold font-mono uppercase font-black tracking-wide">
                        <div className="flex items-center space-x-1.5">
                          <Sparkles className="h-3.5 w-3.5 animate-bounce" />
                          <span>REPAIR MODE ENGAGED</span>
                        </div>
                        <button 
                          onClick={handleClearForm}
                          className="p-1 px-2.5 bg-black border border-zinc-850 rounded hover:text-white cursor-pointer transition text-[10px]"
                        >
                          ABORT
                        </button>
                      </div>
                    )}

                    {/* Auto-Save Active badge */}
                    {autoSaveActive && (
                      <div className="p-1 text-[9px] font-mono bg-zinc-950 border border-zinc-900 rounded text-mystery-gold w-fit px-2.5 flex items-center space-x-1 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-mystery-gold animate-ping"></span>
                        <span>DRAFT AUTO-SAVED LOCALLY</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-b border-zinc-950 pb-3">
                      <div className="flex items-center space-x-2">
                        <Radio className="h-3.5 w-3.5 text-mystery-red animate-pulse shrink-0" />
                        <h3 className="font-display font-black text-xs text-white tracking-widest uppercase">
                          {editMode ? "Repair specs entry" : "Write new historic chronicles"}
                        </h3>
                      </div>
                      <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-550 font-bold px-2.5 py-0.5 rounded uppercase">
                        Composer desk
                      </span>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      {/* CHRONICLE TITLE */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                          Chronicle Header Title (Tamil/English)
                        </label>
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value.slice(0, 75))}
                          placeholder="e.g., The Alchemy of Bhogar Siddhar"
                          className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2.5 px-3 text-white placeholder-zinc-700"
                        />
                      </div>

                      {/* DESCRIPTION SUBTITLE */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                          Executive Summary (Description Subtitle)
                        </label>
                        <input
                          type="text"
                          required
                          value={subtitle}
                          onChange={(e) => setSubtitle(e.target.value)}
                          placeholder="e.g., Unravelling secret navapashanam composition formulas..."
                          className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2.5 px-3 text-zinc-350 placeholder-zinc-700"
                        />
                      </div>

                      {/* COVER IMAGE */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                          Cover Illustration (Static Image URL)
                        </label>
                        <input
                          type="url"
                          required
                          value={thumbnail}
                          onChange={(e) => setThumbnail(e.target.value)}
                          placeholder="e.g., https://images.unsplash.com/photo-..."
                          className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2.5 px-3 text-zinc-350 placeholder-zinc-700"
                        />
                      </div>

                      {/* CATEGORY & TREND */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">Category Sector</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2.5 px-3 text-white"
                          >
                            <option value="mystery">Mystery Stories</option>
                            <option value="horror">Horror Stories</option>
                            <option value="history">Historical Mysteries</option>
                            <option value="ancient-secrets">Ancient Tamil Secrets</option>
                            {customCategoriesList.filter(c => !['mystery', 'horror', 'history', 'ancient-secrets'].includes(c.key)).map(c => (
                              <option key={c.key} value={c.key}>{c.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5 flex flex-col justify-end pb-2 text-left">
                          <label className="inline-flex items-center space-x-2 cursor-pointer text-xs font-bold text-zinc-350 uppercase tracking-wide">
                            <input 
                              type="checkbox"
                              checked={isTrending}
                              onChange={(e) => setIsTrending(e.target.checked)}
                              className="rounded border-zinc-900 bg-zinc-950 text-mystery-red focus:ring-0 cursor-pointer h-4 w-4"
                            />
                            <span>Flag as Trending ⚡</span>
                          </label>
                        </div>
                      </div>

                      {/* TEXTAREA FORM WITH MARKDOWN SHORTCUTS */}
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                            Historical Speculations (Body Lore Text)
                          </label>
                          
                          {/* Rich Text Injection Controls */}
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              onClick={() => injectMarkdown("## ")}
                              className="text-[9px] font-mono bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-400 p-1 px-2.5 rounded cursor-pointer"
                              title="Insert Section Sub-Header"
                            >
                              H2
                            </button>
                            <button
                              type="button"
                              onClick={() => injectMarkdown("### ")}
                              className="text-[9px] font-mono bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-400 p-1 px-2.5 rounded cursor-pointer"
                              title="Insert Subsection Header"
                            >
                              H3
                            </button>
                            <button
                              type="button"
                              onClick={() => injectMarkdown("**", "**")}
                              className="text-[9px] font-mono bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-400 p-1 px-2.5 rounded cursor-pointer"
                              title="Bold selection text"
                            >
                              Bold
                            </button>
                            <button
                              type="button"
                              onClick={() => injectMarkdown("_", "_")}
                              className="text-[9px] font-mono bg-zinc-950 border border-zinc-900 hover:border-zinc-800 text-zinc-400 p-1 px-2.5 rounded cursor-pointer"
                              title="Italic selection text"
                            >
                              Italics
                            </button>
                          </div>
                        </div>

                        <textarea
                          id="chronic-lore-editor"
                          required
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Craft details of your research lore... Supports complete Markdown spacing. Subheadings are mapped with '##' and '###' markers."
                          className="w-full h-56 bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs p-3.5 text-zinc-300 font-serif leading-relaxed resize-none"
                        />
                      </div>

                      {/* BTN RUN */}
                      <div className="flex gap-4 pt-2">
                        <button
                          type="button"
                          onClick={handleClearForm}
                          className="w-1/3 py-2.5 rounded-lg border border-zinc-900 hover:border-zinc-800 text-zinc-500 hover:text-white font-mono text-xs font-black uppercase tracking-wider bg-zinc-950/20 cursor-pointer transition active:scale-95"
                        >
                          FLUSH VALUES
                        </button>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-2/3 bg-gradient-to-r from-mystery-red to-[#bf2121] border border-mystery-gold/15 hover:border-mystery-gold/60 text-white font-black text-xs py-2.5 rounded-lg uppercase tracking-widest shadow-xl flex items-center justify-center space-x-1.5 transition cursor-pointer active:scale-95 disabled:opacity-40"
                        >
                          {loading ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                          <span>{editMode ? "SAVE SPECS TO CLOUD" : "ENGAGE & PUBLISH LIVE"}</span>
                        </button>
                      </div>

                    </form>

                  </div>

                  {/* LIVE PHONIC RESPONSIVE FRAME: 4 COLS */}
                  <div className="xl:col-span-4 space-y-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold block">Responsive mobile device viewport</span>
                    
                    {/* DEVICE SKIN */}
                    <div className="w-full bg-black border-4 border-zinc-900 rounded-[35px] p-2.5 shadow-2xl relative overflow-hidden h-[540px] flex flex-col">
                      <div className="h-4 w-20 bg-zinc-900 mx-auto rounded-b-xl absolute top-0 left-0 right-0 z-40 flex items-center justify-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-950 block"></span>
                      </div>

                      {/* DISPLAY INNER SCREEN */}
                      <div className="bg-[#030304] rounded-[24px] flex-1 overflow-y-auto p-3.5 pt-6 space-y-4 text-left relative z-25">
                        
                        {/* HERO ASS COVER */}
                        <div className="w-full h-32 bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden relative shadow-sm">
                          {thumbnail ? (
                            <img 
                              src={thumbnail} 
                              alt="Cover" 
                              className="w-full h-full object-cover"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-full w-full flex flex-col items-center justify-center space-y-1">
                              <Sparkles className="h-5 w-5 text-mystery-gold animate-pulse" />
                              <span className="text-[8px] font-mono text-zinc-650 tracking-widest uppercase font-bold">Atmosphere</span>
                            </div>
                          )}
                          
                          <span className="absolute bottom-2 left-2 bg-[#8e1b1b] border border-mystery-gold/15 text-[8px] font-mono text-white p-0.5 px-2 rounded-full font-black uppercase tracking-widest">
                            {category}
                          </span>
                        </div>

                        {/* HEAD STAGE */}
                        <div className="space-y-1">
                          <h4 className="font-display font-black text-sm text-zinc-150 uppercase tracking-wide leading-normal">
                            {title || "UNRESOLVED MYSTERY CHRONICLE HEADER"}
                          </h4>
                          <p className="text-[10.5px] text-zinc-500 font-serif leading-relaxed italic">
                            {subtitle || "Legends hidden under history, waiting for revelation..."}
                          </p>
                          <div className="flex justify-between items-center text-[8px] font-mono text-zinc-650 border-t border-b border-zinc-900/65 py-1 font-bold mt-1.5">
                            <span>BY: UNKNOWN TAMIZHA</span>
                            <span className="text-mystery-gold font-bold">★ SENSATIONAL</span>
                          </div>
                        </div>

                        {/* LORE TEXT FLUID */}
                        <div className="space-y-2 prose prose-invert font-serif leading-relaxed font-serif text-zinc-400">
                          {parsePreviewMarkdown(content)}
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* BOTTOM DESK CATALOG CONTROLLER: 12 COLS */}
                  <div className="col-span-full bg-[#08080a] border border-zinc-900 p-6 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-950 pb-3">
                      <div className="flex items-center space-x-2">
                        <Layers className="h-4 w-4 text-mystery-gold animate-bounce shrink-0" />
                        <h4 className="font-display font-extrabold text-xs text-white tracking-widest uppercase">
                          ACTIVE HISTORICAL ARCHIVES DIRECTORY
                        </h4>
                      </div>
                      
                      {/* SEARCH AND FILTER TOOLS */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-56">
                          <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-zinc-550" />
                          <input
                            type="text"
                            placeholder="Query archives..."
                            value={storySearch}
                            onChange={(e) => setStorySearch(e.target.value)}
                            className="w-full bg-[#030304] border border-zinc-850 focus:border-mystery-gold outline-none rounded-lg text-[11px] py-1.5 pl-8 pr-3 text-zinc-200"
                          />
                        </div>

                        <select
                          value={selectedCategoryFilter}
                          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                          className="bg-[#030304] border border-zinc-850 rounded-lg text-[11px] py-1 px-3 text-zinc-400 focus:border-mystery-gold focus:outline-none cursor-pointer"
                        >
                          <option value="all">Sectors: All Combined</option>
                          <option value="mystery">Sector: Mystery Stories</option>
                          <option value="horror">Sector: Horror Stories</option>
                          <option value="history">Sector: Historical Mysteries</option>
                          <option value="ancient-secrets">Sector: Ancient Tamil Secrets</option>
                        </select>
                      </div>
                    </div>

                    {/* BATCH CONTROL CONSOLE */}
                    {filteredStoriesList.length > 0 && (
                      <div className="flex flex-wrap justify-between items-center gap-3 bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-xl mb-4 text-xs">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={handleSelectAllStories}
                            className="text-[10px] bg-[#0c0c10] border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-white px-2.5 py-1 rounded transition-colors font-mono cursor-pointer"
                          >
                            {filteredStoriesList.every(s => selectedStoryIds.includes(s.id))
                              ? "Deselect All Visible"
                              : "Select All Filtered"}
                          </button>
                          <span className="text-zinc-500 font-mono text-[9px] uppercase">
                            ({selectedStoryIds.length} Selected / {filteredStoriesList.length} Visible)
                          </span>
                        </div>

                        {selectedStoryIds.length > 0 && (
                          <div className="flex items-center space-x-2 animate-feed-in">
                            <button
                              type="button"
                              onClick={handleBulkDelete}
                              className="text-[10px] bg-mystery-red/10 border border-mystery-red/30 hover:bg-mystery-red hover:text-white text-mystery-red px-3 py-1 rounded-md transition-all font-mono font-bold flex items-center space-x-1 cursor-pointer"
                            >
                              <X className="h-3 w-3 shrink-0" />
                              <span>Purge Selected ({selectedStoryIds.length})</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => setSelectedStoryIds([])}
                              className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono underline cursor-pointer"
                            >
                              Reset
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* STORY LIST GRID TABLE COMP */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredStoriesList.length === 0 ? (
                        <div className="col-span-full text-center py-12 border border-dashed border-zinc-900 rounded-xl">
                          <Layers className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                          <p className="text-zinc-500 text-xs italic font-serif">No chronicles located matching your specifications.</p>
                        </div>
                      ) : (
                        filteredStoriesList.map((story) => (
                          <div key={story.id} className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/30 flex justify-between items-center gap-4 group hover:bg-black/50 transition duration-300">
                            <div className="flex items-center space-x-3.5 truncate text-left font-[inherit]">
                              {/* Batch Deletion Checkbox Option */}
                              <input
                                type="checkbox"
                                checked={selectedStoryIds.includes(story.id)}
                                onChange={() => toggleSelectStory(story.id)}
                                className="w-3.5 h-3.5 accent-mystery-red rounded bg-zinc-900 border-zinc-850 text-mystery-red cursor-pointer shrink-0"
                                title="Select for deletion"
                              />

                              {story.thumbnail ? (
                                <img 
                                  src={story.thumbnail} 
                                  alt="" 
                                  className="h-10 w-10 rounded-lg object-cover border border-zinc-850 shrink-0 shadow-sm"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center font-bold text-[10px] text-mystery-gold shrink-0 uppercase select-none">
                                  U.T
                                </div>
                              )}
                              
                              <div className="truncate">
                                <h5 className="font-bold text-xs truncate text-zinc-250 group-hover:text-mystery-gold transition-colors">
                                  {story.title}
                                </h5>
                                <div className="flex items-center space-x-2 mt-1 text-[8px] font-mono font-bold text-zinc-550 uppercase">
                                  <span className="text-mystery-red font-black">{story.category}</span>
                                  <span>•</span>
                                  <span>{story.readsCount || 0} Telemetry Views</span>
                                  {story.isTrending && <span className="text-mystery-gold">★ TREND</span>}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1.5 shrink-0">
                              {/* EDIT ACTION BUTTON */}
                              <button
                                onClick={() => handleEditInit(story)}
                                className="p-2 bg-[#0c0c10] hover:bg-black border border-zinc-900 hover:border-mystery-gold/40 text-zinc-500 hover:text-white rounded-lg transition-transform active:scale-90 cursor-pointer"
                                title="Repair Core Attributes"
                              >
                                <X className="h-3.5 w-3.5 rotate-45 text-mystery-gold" />
                              </button>

                              {/* DELETE ACTION BUTTON */}
                              <button
                                onClick={() => handleDelete(story.id, story.title)}
                                className="p-2 bg-[#0c0c10] hover:bg-black border border-zinc-900 hover:border-mystery-red/40 text-zinc-500 hover:text-mystery-red rounded-lg transition-transform active:scale-90 cursor-pointer"
                                title="Purge Record"
                              >
                                <X className="h-3.5 w-3.5 text-mystery-red" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* ROUTE RESOLUTION IN MODULAR PANELS */}

              {/* DIRECT SUB TAB: CATEGORY PANEL */}
              {activeTab === 'categories' && (
                <CategoryManager 
                  onCategoriesChange={(cats) => setCustomCategoriesList(cats)} 
                />
              )}

              {/* DIRECT SUB TAB: MEDIA WORKSPACE */}
              {activeTab === 'media' && <MediaLibrary />}

              {/* DIRECT SUB TAB: YOUTUBE CORE */}
              {activeTab === 'youtube' && <YoutubeTools />}

              {/* DIRECT SUB TAB: COMMENTS FEED PANEL */}
              {activeTab === 'comments' && (
                <div className="bg-[#0b0b0e] border border-zinc-900 rounded-2xl p-6 text-left space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-950 pb-3">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-mystery-gold animate-bounce" />
                      <h3 className="font-display font-black text-xs text-white tracking-widest uppercase">
                        INTERACTIVE AUDIT OF SOCIAL COMMENTS
                      </h3>
                    </div>

                    <div className="flex items-center space-x-1.5 bg-[#030304] p-1 border border-zinc-850 rounded-lg">
                      <button
                        onClick={() => setCommentsFilter("all")}
                        className={`text-[10px] font-mono font-bold p-1 px-3 rounded-md transition cursor-pointer ${
                          commentsFilter === "all" ? 'bg-mystery-gold text-black' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setCommentsFilter("pending")}
                        className={`text-[10px] font-mono font-bold p-1 px-3 rounded-md transition cursor-pointer ${
                          commentsFilter === "pending" ? 'bg-mystery-gold text-black animate-pulse' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Pending approval ({comments.filter(c => !c.approved).length})
                      </button>
                      <button
                        onClick={() => setCommentsFilter("approved")}
                        className={`text-[10px] font-mono font-bold p-1 px-3 rounded-md transition cursor-pointer ${
                          commentsFilter === "approved" ? 'bg-mystery-gold text-black' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        Approved
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredCommentsList.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-zinc-900 rounded-2xl">
                        <MessageSquare className="h-10 w-10 text-zinc-700 mx-auto mb-2" />
                        <p className="text-zinc-500 italic font-serif text-[11px]">No feedback documents are registered under this search class.</p>
                      </div>
                    ) : (
                      filteredCommentsList.map((c) => (
                        <div key={c.id} className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-zinc-850 transition duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2.5">
                              <span className="font-bold text-xs text-white uppercase">{c.commenter}</span>
                              <span className="text-[8px] font-mono font-bold text-zinc-500 bg-zinc-900 p-0.5 px-2 rounded">
                                {c.time}
                              </span>
                              {c.approved ? (
                                <span className="text-[8px] font-mono font-black text-green-400 bg-green-950/25 border border-green-900 p-0.5 px-1.5 rounded uppercase">
                                  LIVE APPROVED
                                </span>
                              ) : (
                                <span className="text-[8px] font-mono font-black text-mystery-gold bg-amber-950/20 border border-mystery-gold/30 p-0.5 px-1.5 rounded uppercase animate-pulse">
                                  PENDING APPROVAL
                                </span>
                              )}
                            </div>
                            
                            <p className="text-[11px] leading-relaxed text-zinc-350 italic font-serif select-default">
                              "{c.text}"
                            </p>
                            
                            <p className="text-[9px] font-mono font-bold text-zinc-550 block">
                              Associated chronicle lore link: <strong className="text-zinc-400 font-semibold">{c.storyTitle}</strong>
                            </p>
                          </div>

                          <div className="flex gap-2 self-stretch sm:self-center shrink-0 items-center justify-end">
                            {/* APPROVE ACTION */}
                            {!c.approved && (
                              <button
                                onClick={() => handleApproveComment(c.id)}
                                className="p-1 px-3 rounded bg-green-950/20 hover:bg-green-950 border border-green-900 hover:border-green-800 text-green-400 hover:text-white transition cursor-pointer text-[10px] font-mono font-bold uppercase flex items-center space-x-1"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>APPROVE</span>
                              </button>
                            )}
                            
                            {/* DELETE ACTION */}
                            <button
                              onClick={() => handleDeleteComment(c.id)}
                              className="p-1.5 rounded bg-[#100c0f] border border-zinc-900 text-zinc-500 hover:text-mystery-red hover:border-mystery-red/35 transition cursor-pointer"
                              title="Delete comment document"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* DIRECT SUB TAB: COCKPIT METRICS (ANALYTICS GRAPHS) */}
              {activeTab === 'analytics' && (
                <div className="space-y-8 text-left animate-fade-in">
                  
                  {/* EXPANDED INTERACTIVE STATS ROW */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 bg-gradient-to-br from-[#0c0c0f] to-zinc-950 border border-zinc-900 rounded-xl relative overflow-hidden select-none cursor-default">
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">AVG Reads per tail</p>
                      <p className="text-white text-2xl font-black mt-1">
                        {stories.length > 0 ? (stories.reduce((a, s) => a + (s.readsCount || 0), 0) / stories.length).toFixed(1) : "0.0"}
                      </p>
                      <div className="mt-3.5 text-[9px] text-[#8e1b1b] font-mono uppercase font-black">optimal readability matched</div>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-[#0c0c0f] to-zinc-950 border border-zinc-900 rounded-xl relative overflow-hidden select-none cursor-default">
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Portal sign-up conversions</p>
                      <p className="text-white text-2xl font-black mt-1">
                        {stories.length > 0 ? (newsletterEmails.length / stories.length * 100).toFixed(0) : "0"}%
                      </p>
                      <div className="mt-3.5 text-[9px] text-mystery-gold font-mono uppercase font-black">optimal subscriber calibration</div>
                    </div>

                    <div className="p-5 bg-gradient-to-br from-[#0c0c0f] to-zinc-950 border border-zinc-900 rounded-xl relative overflow-hidden select-none cursor-default">
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Fidelity server health</p>
                      <p className="text-emerald-400 text-2xl font-black mt-1">99.8% ONLINE</p>
                      <div className="mt-3.5 text-[9px] text-emerald-500 font-mono uppercase font-black">all operations directories live</div>
                    </div>
                  </div>

                  {/* DOUBLE DIAGRAM REGION */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    
                    {/* BAR CHART COL */}
                    <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest block border-b border-zinc-950 pb-2">CHRONICLES READ DENSITY BAR GRAPH</span>
                      <div className="h-64 mt-4 text-[10px]">
                        {chartStoriesData.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-zinc-650 italic font-serif">No analytic vectors loaded yet.</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartStoriesData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                              <XAxis dataKey="name" stroke="#52525b" />
                              <YAxis stroke="#52525b" />
                              <RechartsTooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#1f1f23' }} />
                              <Bar dataKey="reads" fill="#8e1b1b" name="Reads count shadow" />
                              <Bar dataKey="subscribers" fill="#d4af37" name="Subscriber hooks" />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    {/* AREA CHART FOR WEEKLY VISITOR VISIBILITY */}
                    <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest block border-b border-zinc-950 pb-2">DAILY VISITORS GROWTH FLOW INDEX</span>
                      <div className="h-64 mt-4 text-[10px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={visitorAnalyticsData}>
                            <defs>
                              <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8e1b1b" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#8e1b1b" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                            <XAxis dataKey="name" stroke="#52525b" />
                            <YAxis stroke="#52525b" />
                            <RechartsTooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#1f1f23' }} />
                            <Area type="monotone" dataKey="viewers" stroke="#8e1b1b" fillOpacity={1} fill="url(#colorViewers)" name="Unique visitors index" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* PIE CHART SECTOR WEIGHT */}
                    <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4 xl:col-span-1">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest block border-b border-zinc-950 pb-2">CHRONIC GENRE RATIO SPLIT</span>
                      <div className="h-64 mt-4 flex items-center justify-center text-[10px]">
                        <div className="w-1/2 h-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryPieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {categoryPieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                              </Pie>
                              <RechartsTooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#1f1f23' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 space-y-2 text-xs font-mono font-bold uppercase text-left pl-4 border-l border-zinc-900">
                          {categoryPieData.map((e, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <span className="h-2 w-2 rounded-full block shrink-0" style={{ backgroundColor: PIE_COLORS[i] }}></span>
                              <span className="text-zinc-400 text-[10px]">{e.name}: <strong>{e.value}</strong> dossiers</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* VISITOR TRAFFIC ORIGIN STATS */}
                    <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4 xl:col-span-1">
                      <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest block border-b border-zinc-950 pb-2">GEO REFERRAL ORIGIN PATHS</span>
                      <div className="space-y-3.5 pt-2 text-left">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-400 font-medium">1. YouTube Referrals (Direct video card links)</span>
                          <span className="font-mono text-mystery-gold font-bold">58% velocity</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-mystery-gold h-full rounded-full" style={{ width: '58%' }}></div>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-400 font-medium">2. Google Search (Historical query cards keywords)</span>
                          <span className="font-mono text-mystery-red font-bold">28% velocity</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-mystery-red h-full rounded-full" style={{ width: '28%' }}></div>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-400 font-medium">3. Spotify Podcasts links (Under specs cards description)</span>
                          <span className="font-mono text-blue-500 font-bold">14% velocity</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: '14%' }}></div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* DIRECT SUB TAB: SYSTEM SETTINGS AND SEO */}
              {activeTab === 'settings' && (
                <SettingsPanel 
                  stories={stories} 
                  onBackupSuccess={(msg) => {
                    setSuccessMsg(msg);
                    setTimeout(() => setSuccessMsg(""), 3500);
                  }}
                />
              )}

              {/* DIRECT SUB TAB: NEWSLETTER SUBSCRIBER DIRECTORY */}
              {activeTab === 'subscribers' && (
                <div className="bg-[#0b0b0e] border border-zinc-900 rounded-2xl p-6 text-left space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-950 pb-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-mystery-gold animate-bounce" />
                      <h3 className="font-display font-black text-xs text-white tracking-widest uppercase">
                        ACTIVE NEWSLETTER SUBSCRIBERS DIRECTORY
                      </h3>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <div className="relative w-full sm:w-56">
                        <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-zinc-550" />
                        <input
                          type="text"
                          placeholder="Search subscribers..."
                          value={subscriberSearch}
                          onChange={(e) => setSubscriberSearch(e.target.value)}
                          className="w-full bg-[#030304] border border-zinc-850 focus:border-mystery-gold outline-none rounded-lg text-[11px] py-1.5 pl-8 pr-3 text-zinc-150"
                        />
                      </div>

                      <button
                        onClick={handleExportCSV}
                        disabled={newsletterEmails.length === 0}
                        className="px-4 py-2 border border-zinc-800 hover:border-mystery-gold text-zinc-400 hover:text-white rounded-lg text-xs font-mono font-black uppercase tracking-wider transition bg-zinc-950/40 cursor-pointer disabled:opacity-40 flex items-center justify-center space-x-1.5 active:scale-95 text-center select-none shrink-0"
                      >
                        <FileDown className="h-3.5 w-3.5 text-mystery-gold" />
                        <span>EXPORT TO CSV</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                    {filteredSubsList.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-zinc-900 rounded-2xl">
                        <Mail className="h-10 w-10 text-zinc-700 mx-auto mb-2" />
                        <p className="text-zinc-500 italic font-serif text-[11px]">No subscribers match your query parameters.</p>
                      </div>
                    ) : (
                      filteredSubsList.map((sub) => (
                        <div key={sub.id} className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl hover:border-zinc-850 transition duration-300 flex items-center justify-between gap-4">
                          <div className="flex items-center space-x-3 text-xs">
                            <div className="h-7 w-7 rounded-full bg-[#0e0e11] border border-zinc-900 flex items-center justify-center font-bold text-zinc-550 uppercase">
                              @
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-zinc-200">{sub.email}</p>
                              <span className="text-[9px] font-mono text-zinc-550 block">Signed up: {sub.createdAt ? String(sub.createdAt).substring(0, 10) : "Undated"}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteSubscriber(sub.id, sub.email)}
                            className="p-1 px-3 text-[10px] font-mono font-semibold bg-[#100c0f] border border-zinc-950 hover:border-mystery-red/30 rounded text-zinc-500 hover:text-mystery-red transition cursor-pointer"
                          >
                            EXPEL
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
};
