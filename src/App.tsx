import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { StoriesView } from './views/StoriesView';
import { AiGeneratorView } from './views/AiGeneratorView';
import { CreatorToolsView } from './views/CreatorToolsView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';
import { Story } from './types';
import { Lock, LogIn, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const InnerApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const { user, isAdmin, loginWithGoogle } = useApp();

  const handleReadStory = (story: Story) => {
    setActiveStory(story);
    setActiveTab('stories');
  };

  // Switch content panel based on active navigation tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            setActiveTab={setActiveTab} 
            setSelectedCategory={setSelectedCategory} 
            onReadStory={handleReadStory}
          />
        );
      case 'stories':
        return (
          <StoriesView 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            activeStory={activeStory}
            setActiveStory={setActiveStory}
          />
        );
      case 'ai-generator':
        return <AiGeneratorView />;
      case 'creator-tools':
        return <CreatorToolsView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView setActiveTab={setActiveTab} setSelectedCategory={setSelectedCategory} onReadStory={handleReadStory} />;
    }
  };

  return (
    <div className="min-h-screen bg-mystery-black flex flex-col justify-between selection:bg-mystery-red selection:text-white">
      <div>
        {/* NAV HEADERS */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* RENDERING FEED VIEWS WITH SMOOTH MOTION SLIDES */}
        <main className="pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* FOOTER METADATA ROWS */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  );
}
