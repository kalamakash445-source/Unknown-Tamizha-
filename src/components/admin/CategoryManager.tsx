import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Check, Sparkles } from 'lucide-react';

export interface CustomCategory {
  key: string;
  label: string;
  color: string;
  desc: string;
  icon: string;
  storyCount: number;
}

interface CategoryProps {
  onCategoriesChange?: (cats: CustomCategory[]) => void;
}

export const CategoryManager: React.FC<CategoryProps> = ({ onCategoriesChange }) => {
  // Preset default robust categories
  const defaultCategories: CustomCategory[] = [
    {
      key: 'mystery',
      label: 'Mystery Stories',
      color: '#d4af37',
      desc: 'Enigmas, riddles of siddhars, and alchemy speculation.',
      icon: '✦',
      storyCount: 5
    },
    {
      key: 'horror',
      label: 'Horror Lore',
      color: '#8e1b1b',
      desc: 'Spiritual entities, haunted ancient ruins, and spectral sightings.',
      icon: '☠',
      storyCount: 3
    },
    {
      key: 'history',
      label: 'Historical Mysteries',
      color: '#3b82f6',
      desc: 'Lost dynasties, epic Chola war strategies, and secret scriptures.',
      icon: '🛡',
      storyCount: 4
    },
    {
      key: 'ancient-secrets',
      label: 'Ancient Tamil Secrets',
      color: '#a855f7',
      desc: 'Bhogar, Kumari Kandam, and ancient scientific technologies.',
      icon: '🧬',
      storyCount: 6
    }
  ];

  const [categories, setCategories] = useState<CustomCategory[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("#d4af37");
  const [newDesc, setNewDesc] = useState("");
  const [newIcon, setNewIcon] = useState("✦");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem('unknown_tamizha_custom_categories');
    if (saved) {
      try {
        setCategories(JSON.parse(saved));
      } catch (e) {
        setCategories(defaultCategories);
      }
    } else {
      setCategories(defaultCategories);
      localStorage.setItem('unknown_tamizha_custom_categories', JSON.stringify(defaultCategories));
    }
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      if (onCategoriesChange) {
        onCategoriesChange(categories);
      }
    }
  }, [categories]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newLabel.trim()) return;

    const formattedKey = newKey.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    if (categories.some(c => c.key === formattedKey)) {
      alert("A category with this key code already exists!");
      return;
    }

    const newCat: CustomCategory = {
      key: formattedKey,
      label: newLabel.trim(),
      color: newColor,
      desc: newDesc.trim() || 'Custom user created category.',
      icon: newIcon,
      storyCount: 0
    };

    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem('unknown_tamizha_custom_categories', JSON.stringify(updated));

    setSuccessMsg(`Custom category "${newLabel}" successfully authorized of the core matrix!`);
    
    // Clear
    setNewKey("");
    setNewLabel("");
    setNewColor("#d4af37");
    setNewDesc("");
    setNewIcon("✦");

    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDeleteCategory = (key: string, label: string) => {
    // Protect core categories
    const coreKeys = ['mystery', 'horror', 'history', 'ancient-secrets'];
    if (coreKeys.includes(key)) {
      alert("Error: Core Tamil genres cannot be purged. Unlocks are protected by portal firewalls.");
      return;
    }

    if (window.confirm(`Are you absolutely sure you want to permanently delete custom category: "${label}"? This is irreversible.`)) {
      const updated = categories.filter(c => c.key !== key);
      setCategories(updated);
      localStorage.setItem('unknown_tamizha_custom_categories', JSON.stringify(updated));
      setSuccessMsg(`Purged category "${label}" successfully.`);
      setTimeout(() => setSuccessMsg(""), 3500);
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* SUCCESS ALERTS */}
      {successMsg && (
        <div className="p-3 bg-green-950/20 border border-green-800 text-green-400 text-xs font-mono rounded-xl">
          ✦ {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COMPOSER FORM: 5 COLS */}
        <div className="lg:col-span-5 bg-[#0b0b0e] border border-zinc-900 rounded-2xl p-6 space-y-5">
          <div className="flex items-center space-x-2.5 border-b border-zinc-950 pb-3">
            <span className="p-1 px-2 text-[9px] bg-mystery-gold text-black uppercase font-black tracking-widest rounded animate-pulse">
              EXPAND
            </span>
            <h4 className="font-display font-bold text-xs text-zinc-100 tracking-wider uppercase">
              REGISTER NEW TAMIL SECTORS
            </h4>
          </div>

          <form onSubmit={handleAddCategory} className="space-y-4">
            
            {/* KEY CODE ID */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Genre Key Code (Alphanumeric unique)
              </label>
              <input
                type="text"
                required
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g., siddhar-sciences"
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2.5 px-3 text-white font-mono placeholder-zinc-700"
              />
            </div>

            {/* HUMAN READABLE LABEL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Genre Title Name
              </label>
              <input
                type="text"
                required
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g., Siddhar Alchemy Science"
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2.5 px-3 text-white placeholder-zinc-650"
              />
            </div>

            {/* DESCRIPTION IN SHORT */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Archival Scope (Description)
              </label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Brief summary of the legend concepts classified inside this niche category..."
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2 px-3 h-20 text-zinc-300 placeholder-zinc-650 resize-none font-serif leading-relaxed"
              />
            </div>

            {/* METADATA ACCENTS (COLOR + ICON) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                  Sect Color Accent
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="bg-transparent border-0 cursor-pointer h-9 w-9 rounded"
                  />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">{newColor}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                  Glyph Symbol / Icon
                </label>
                <select
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2 px-3 text-white"
                >
                  <option value="✦">✦ Star glyph</option>
                  <option value="🧬">🧬 Science helix</option>
                  <option value="𓋹">𓋹 Ankh emblem</option>
                  <option value="⚜">⚜ crest crest</option>
                  <option value="🛡">🛡 Chola shield</option>
                  <option value="🗝">🗝 Golden Key</option>
                  <option value="❀">❀ Tamil lotus</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-mystery-red to-[#bf2121] select-none text-white font-black text-xs py-2.5 rounded-lg transition duration-200 uppercase tracking-widest border border-mystery-gold/10 hover:border-mystery-gold/50 cursor-pointer text-center flex items-center justify-center space-x-1.5 hover:shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>COMMIT CATEGORY</span>
            </button>

          </form>
        </div>

        {/* LIST PREVIEWS COLUMN: 7 COLS */}
        <div className="lg:col-span-7 bg-[#09090c]/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-905 pb-3">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-mystery-gold animate-bounce" />
              <h4 className="text-xs font-mono font-black text-white tracking-widest uppercase">
                EXISTING CHRONICLE SECTS
              </h4>
            </div>
            <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold px-2.5 py-0.5 rounded">
              {categories.length} IN REGISTRY
            </span>
          </div>

          <div className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
            {categories.map((c) => {
              const coreKeys = ['mystery', 'horror', 'history', 'ancient-secrets'];
              const isCore = coreKeys.includes(c.key);
              
              return (
                <div key={c.key} className="p-4 bg-zinc-950/80 border border-zinc-900/60 hover:border-zinc-850 rounded-xl flex items-start justify-between gap-4 group transition-all duration-300">
                  <div className="flex items-start space-x-3 text-left">
                    {/* METRIC GLYPH */}
                    <div 
                      className="h-10 w-10 text-white rounded-lg font-mono text-sm flex items-center justify-center shrink-0 border"
                      style={{ backgroundColor: `${c.color}15`, borderColor: `${c.color}40`, color: c.color }}
                    >
                      {c.icon}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-xs text-white uppercase group-hover:text-mystery-gold transition-colors">
                          {c.label}
                        </p>
                        <span className="text-[8px] font-mono text-zinc-600 bg-zinc-900 p-0.5 px-2 rounded font-black">
                          {c.key}
                        </span>
                        {isCore && (
                          <span className="text-[8px] font-mono text-mystery-gold bg-amber-950/20 border border-mystery-gold/30 p-0.5 px-1.5 rounded font-black uppercase">
                            CORE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-serif text-zinc-450 italic leading-snug">
                        {c.desc}
                      </p>
                    </div>
                  </div>

                  {/* ACTION CORNER */}
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                    <span className="text-[10px] font-mono text-zinc-550">
                      Node links: <strong className="text-zinc-400">{c.storyCount}</strong>
                    </span>
                    
                    {!isCore ? (
                      <button
                        onClick={() => handleDeleteCategory(c.key, c.label)}
                        className="text-zinc-650 hover:text-mystery-red transition mt-2 p-1 bg-zinc-900 border border-zinc-950 rounded hover:border-mystery-red/30 cursor-pointer"
                        title="Dismantle Sect"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <span className="text-[8px] text-zinc-700 font-mono font-bold uppercase mt-2">SECURED</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
