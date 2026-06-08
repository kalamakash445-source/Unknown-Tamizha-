import React, { useState } from 'react';
import { Upload, X, Search, FileImage, Trash2, Check, Copy, ExternalLink } from 'lucide-react';

export const MediaLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  
  // High-fidelity preseeded atmospheric Tamil mysteries & textures assets
  const [mediaItems, setMediaItems] = useState([
    {
      id: 'media1',
      name: 'mahabalipuram_shore_mystery.jpg',
      url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=600',
      type: 'image/jpeg',
      dimensions: '1925 x 1080',
      size: '425 KB'
    },
    {
      id: 'media2',
      name: 'mystic_palm_leaf_manuscripts.jpg',
      url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600',
      type: 'image/png',
      dimensions: '1024 x 1024',
      size: '230 KB'
    },
    {
      id: 'media3',
      name: 'ancient_bronze_nataraja_idol.jpg',
      url: 'https://images.unsplash.com/photo-1608976328267-e673d3ec06ce?auto=format&fit=crop&q=80&w=600',
      type: 'image/jpeg',
      dimensions: '1200 x 800',
      size: '312 KB'
    },
    {
      id: 'media4',
      name: 'abyssal_temple_gopuram_scenic.jpg',
      url: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=600',
      type: 'image/jpeg',
      dimensions: '2048 x 1152',
      size: '516 KB'
    },
    {
      id: 'media5',
      name: 'dark_constellation_scroll_texture.jpg',
      url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=600',
      type: 'image/webp',
      dimensions: '1440 x 900',
      size: '185 KB'
    },
    {
      id: 'media6',
      name: 'alchemical_copper_plate_inscriptions.jpg',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600',
      type: 'image/jpeg',
      dimensions: '1920 x 1080',
      size: '388 KB'
    }
  ]);

  const [dragActive, setDragActive] = useState(false);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const fileListArray = Array.from(files);
    
    fileListArray.forEach((file) => {
      // FileReader to mock URL and inject into current dataset
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem = {
          id: `media-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: file.name,
          url: (reader.result as string) || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600',
          type: file.type || 'image/png',
          dimensions: 'Mock 1080 x 1080',
          size: `${(file.size / 1024).toFixed(0)} KB`
        };

        setMediaItems(prev => [newItem, ...prev]);
        setSuccessMsg(`"${file.name}" uploaded successfully to database store.`);
        setTimeout(() => setSuccessMsg(""), 4000);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Permanently drop "${name}" from media store?`)) {
      setMediaItems(prev => prev.filter(item => item.id !== id));
      setSuccessMsg(`Purged ${name} from memory successfully`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const filteredMedia = mediaItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left">
      
      {/* ACTION MESSAGES */}
      {successMsg && (
        <div className="p-3 bg-green-950/20 border border-green-800 text-green-400 text-xs font-mono rounded-xl">
          ✦ {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* DRAG-DROP UPLOADER COLUMN: 4 COLS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0b0b0e] border border-zinc-900 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-mono font-black text-white tracking-widest uppercase border-b border-zinc-950 pb-2">
              MEDIA CARGO DOCK
            </h4>
            <p className="text-[11px] text-zinc-500 font-serif leading-relaxed">
              Upload custom illustrations, thumbnail covers, or visual lore nodes. File outputs will be assigned static links usable in any article markdown.
            </p>

            {/* DRAG & DROP INS */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 relative ${
                dragActive 
                  ? 'border-mystery-gold bg-mystery-gold/5' 
                  : 'border-zinc-900 bg-zinc-950/20 hover:border-zinc-800'
              }`}
            >
              <input 
                type="file" 
                id="media-uploader-input"
                multiple 
                accept="image/*"
                onChange={handleFileInput}
                className="hidden" 
              />
              <Upload className={`h-8 w-8 mb-3 transition ${dragActive ? 'text-mystery-gold animate-bounce' : 'text-zinc-650'}`} />
              <label 
                htmlFor="media-uploader-input"
                className="text-xs font-bold text-zinc-350 hover:text-mystery-gold cursor-pointer transition underline decoration-dotted decoration-zinc-700"
              >
                Choose Local Media
              </label>
              <p className="text-[10px] text-zinc-550 font-mono mt-2">or drap-drop static files here</p>
              <p className="text-[9px] text-zinc-600 font-mono mt-1">PNG, JPG, WEBP bounds (Max 5MB)</p>
            </div>
          </div>

          {/* CLOUD SPECS GRID */}
          <div className="p-5 bg-zinc-950/30 border border-zinc-900 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block">MEDIA CLOUD POOL</span>
              <span className="text-sm font-mono font-black text-white">{mediaItems.length} Registered</span>
            </div>
            <div className="text-right text-[10px] font-mono text-zinc-400">
              <span className="text-mystery-gold font-bold">1.9 MB</span> / 512 MB Used
            </div>
          </div>
        </div>

        {/* GALLERY WRAPPER COLUMN: 8 COLS */}
        <div className="lg:col-span-8 bg-[#09090c]/40 border border-zinc-900 p-6 rounded-2xl space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-900 pb-3">
            <h4 className="text-xs font-mono font-black text-white tracking-widest uppercase">
              GALLERY DEPOSITORIES / MANIFESTS
            </h4>
            
            {/* SEARCH */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-zinc-550" />
              <input
                type="text"
                placeholder="Search file names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#030304] border border-zinc-850 focus:border-mystery-gold rounded-lg py-1.5 pl-8 pr-3 text-[11px] text-zinc-150 outline-none"
              />
            </div>
          </div>

          {/* MEDIA LIST GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 max-h-[460px] overflow-y-auto pr-1">
            {filteredMedia.length === 0 ? (
              <div className="col-span-full text-center py-16 border border-dashed border-zinc-900 rounded-2xl">
                <FileImage className="h-10 w-10 text-zinc-700 mx-auto mb-2" />
                <p className="text-zinc-500 italic font-serif text-[11px]">No deposits match your search criteria.</p>
              </div>
            ) : (
              filteredMedia.map((item) => (
                <div key={item.id} className="bg-zinc-950/80 border border-zinc-900/60 rounded-xl overflow-hidden shadow-md flex flex-col group hover:border-zinc-800 transition duration-300">
                  {/* PREVIEW CONTAINER */}
                  <div className="h-32 bg-zinc-900 relative overflow-hidden flex items-center justify-center">
                    <img 
                      src={item.url} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-550"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                      <span className="text-[8px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 p-0.5 rounded px-2">
                        {item.dimensions}
                      </span>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-zinc-350 hover:text-white p-1 bg-zinc-900 rounded border border-zinc-800 cursor-pointer"
                        title="Open Source URL"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {/* INFO BAR */}
                  <div className="p-3 select-none flex-1 flex flex-col justify-between space-y-2.5">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-mono font-bold text-zinc-300 truncate" title={item.name}>
                        {item.name}
                      </p>
                      <div className="flex justify-between items-center text-[8px] font-mono text-zinc-650">
                        <span>{item.type}</span>
                        <span>{item.size}</span>
                      </div>
                    </div>

                    {/* ACTIONS ROW */}
                    <div className="grid grid-cols-5 gap-2 border-t border-zinc-900 pt-2">
                      <button
                        onClick={() => handleCopyLink(item.url, item.id)}
                        className={`col-span-4 p-1 rounded font-mono text-[9px] font-bold border flex items-center justify-center space-x-1 transition cursor-pointer ${
                          copiedId === item.id 
                            ? 'bg-green-950/20 border-green-800 text-green-400 font-bold' 
                            : 'bg-zinc-900 border-zinc-850 hover:border-mystery-gold text-zinc-400 hover:text-white'
                        }`}
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="h-3 w-3 text-green-400 animate-pulse" />
                            <span>COPIED SITE PATH</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>COPY ASSET URL</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="col-span-1 p-1 rounded bg-[#100c0f] border border-zinc-900 text-zinc-600 hover:text-mystery-red hover:bg-[#8e1b1b]/10 hover:border-mystery-red/30 transition flex items-center justify-center cursor-pointer"
                        title="Purge File"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
