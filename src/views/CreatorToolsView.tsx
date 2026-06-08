import React, { useState } from 'react';
import { Youtube, Copy, Check, RefreshCw, Image, Info, Award, Tag, Sparkles } from 'lucide-react';

export const CreatorToolsView: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("mystery");
  const [style, setStyle] = useState("thrilling");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    titles: string[];
    thumbnailPrompt: string;
    description: string;
    hashtags: string[];
  } | null>(null);

  const [copyState, setCopyState] = useState<{ [key: string]: boolean }>({});

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || loading) return;

    setLoading(true);
    setResults(null);
    setCopyState({});

    try {
      const response = await fetch("/api/gemini/youtube-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, category, style }),
      });

      const data = await response.json();
      if (response.ok) {
        setResults({
          titles: data.titles || [],
          thumbnailPrompt: data.thumbnailPrompt || "",
          description: data.description || "",
          hashtags: data.hashtags || []
        });
      } else {
        throw new Error(data.error || "Failed to generate YouTube parameters.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Error generating tool parameters: " + (err.message || "Unknown issue loading parameters."));
    } finally {
      setLoading(false);
    }
  };

  const triggerCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyState((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopyState((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 space-y-8">
      
      {/* HEADER ROW */}
      <div className="space-y-1">
        <span className="text-[10px] bg-red-950/40 border border-red-800/40 rounded px-2.5 py-0.5 uppercase tracking-widest font-mono text-mystery-red font-bold">
          VIRAL OPTIMIZATION TOOLKIT
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-widest uppercase text-white">
          Creator Tools Lab
        </h1>
        <p className="text-zinc-500 text-xs italic font-serif">
          Harness Gemini intelligence to generate high-CTR video metadata, professional summaries, and visual prompts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT CONTROL SIDE FORM */}
        <div className="bg-[#0b0b0d] border border-zinc-850 p-6 rounded-xl space-y-5 h-fit">
          <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
            <Youtube className="h-4.5 w-4.5 text-mystery-red" />
            <h2 className="font-display font-medium text-xs text-zinc-200 uppercase tracking-widest">
              Video Parameters
            </h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* TOPIC */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Video Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Hidden treasures of Thanjavur Big Temple"
                className="w-full bg-[#111115] border border-zinc-800 focus:border-mystery-gold rounded-lg py-2.5 px-3 text-xs text-zinc-200 outline-none"
                required
              />
            </div>

            {/* CATEGORY */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#111115] border border-zinc-800 focus:border-mystery-gold rounded-lg py-2.5 px-3 text-xs text-zinc-300 outline-none"
              >
                <option value="mystery">Mystery</option>
                <option value="horror">Horror</option>
                <option value="ancient-secrets">Ancient Secrets</option>
                <option value="history">Lost History</option>
              </select>
            </div>

            {/* VIBE / STYLE */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Presentation Vibe Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-[#111115] border border-zinc-800 focus:border-mystery-gold rounded-lg py-2.5 px-3 text-xs text-zinc-300 outline-none"
              >
                <option value="thrilling">Spine-chilling & Occult Vibe</option>
                <option value="documentary">Documentary & Forensic Evidence</option>
                <option value="storytelling">Suspense Storytelling Vibe</option>
              </select>
            </div>

            {/* TRIGGER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-mystery-red to-mystery-red border border-mystery-gold/20 hover:border-mystery-gold hover:from-[#bf2121] py-3 rounded-lg text-white text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 disabled:pointer-events-none disabled:opacity-40 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Harvesting Metadata...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-mystery-gold" />
                  <span>Decrypt Parameters</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* RIGHT METADATA OUTPUTS SLOTS */}
        <div className="lg:col-span-2">
          
          {loading ? (
            <div className="bg-[#050505] border-2 border-dashed border-zinc-900 rounded-xl p-16 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[420px]">
              <div className="h-10 w-10 border-4 border-mystery-red/35 border-t-mystery-gold rounded-full animate-spin" />
              <p className="text-zinc-400 font-serif italic text-xs animate-pulse max-w-sm">
                "Analyzing video concepts, extracting high-CTR titles, and formulating expert AI image-generation prompts..."
              </p>
            </div>
          ) : results ? (
            
            <div className="space-y-6 h-full">
              
              {/* ROW 1: TRENDING VIRAL VIDEO TITLES */}
              <div className="bg-[#0c0c0e] border border-zinc-850 p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <div className="flex items-center space-x-1.5 text-xs text-mystery-gold font-bold uppercase tracking-wider">
                    <Award className="h-3.5 w-3.5 text-mystery-gold" />
                    <span>Trending High-CTR Title Options</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {results.titles.map((title, id) => (
                    <div 
                      key={id} 
                      className="p-3 bg-black/40 border border-zinc-900 rounded-lg hover:border-zinc-800 transition-all flex items-center justify-between gap-3 text-xs text-zinc-100 font-medium font-sans leading-relaxed"
                    >
                      <span>{title}</span>
                      <button
                        onClick={() => triggerCopy(title, `title-${id}`)}
                        className="p-1.5 rounded hover:bg-zinc-850 text-zinc-500 hover:text-white transition cursor-pointer"
                        title="Copy Title Idea"
                      >
                        {copyState[`title-${id}`] ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROW 2: THUMBNAIL DESIGN PROMPTS */}
              <div className="bg-[#0c0c0e] border border-zinc-850 p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <div className="flex items-center space-x-1.5 text-xs text-mystery-gold font-bold uppercase tracking-wider">
                    <Image className="h-3.5 w-3.5 text-mystery-gold" />
                    <span>AI Thumbnail Prompt Syntax</span>
                  </div>
                  <button
                    onClick={() => triggerCopy(results.thumbnailPrompt, "prompt")}
                    className="flex items-center space-x-1 text-[10px] text-zinc-500 hover:text-white cursor-pointer"
                  >
                    {copyState["prompt"] ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    <span>{copyState["prompt"] ? "Copied" : "Copy Prompt"}</span>
                  </button>
                </div>
                <p className="text-zinc-400 text-xs bg-black/30 p-3.5 rounded-lg border border-zinc-900 leading-relaxed font-mono">
                  {results.thumbnailPrompt}
                </p>
                <div className="text-[9px] text-zinc-500 font-serif flex items-center gap-1">
                  <Info className="h-3 w-3 text-mystery-gold" />
                  <span>Tip: Copy this prompt directly into Midjourney, Stable Diffusion, or Imagen to generate extremely atmospheric thumbnails.</span>
                </div>
              </div>

              {/* ROW 3: DESCRIPTION AND HASHTAGS */}
              <div className="bg-[#0c0c0e] border border-zinc-850 p-5 rounded-xl space-y-4">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-1">
                    <span className="text-xs text-mystery-gold font-bold uppercase tracking-wider">SEO Description</span>
                    <button
                      onClick={() => triggerCopy(results.description, "desc")}
                      className="text-[10px] text-zinc-450 hover:text-white flex items-center space-x-1 cursor-pointer"
                    >
                      {copyState["desc"] ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      <span>Copy Description</span>
                    </button>
                  </div>
                  <p className="text-zinc-400 bg-black/30 p-3 rounded-lg text-xs leading-relaxed max-h-36 overflow-y-auto font-sans border border-zinc-905">
                    {results.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-1">
                    <span className="text-xs text-mystery-gold font-bold uppercase tracking-wider flex items-center gap-0.5"><Tag className="h-3.5 w-3.5" /> Viral Metadata Hashtags</span>
                    <button
                      onClick={() => triggerCopy(results.hashtags.join(" "), "tags")}
                      className="text-[10px] text-zinc-450 hover:text-white flex items-center space-x-1 cursor-pointer"
                    >
                      {copyState["tags"] ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      <span>Copy Hashtags</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {results.hashtags.map((tag, id) => (
                      <span key={id} className="text-xs font-semibold bg-red-950/20 text-mystery-red px-2.5 py-1 rounded border border-[#8e1b1b]/20 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          ) : (
            <div className="bg-[#050505] border-2 border-dashed border-zinc-900 rounded-xl p-16 flex flex-col items-center justify-center text-center space-y-4 h-full min-h-[420px]">
              <Youtube className="h-10 w-10 text-zinc-750 animate-pulse" />
              <h3 className="font-display text-sm font-bold text-zinc-400 uppercase tracking-widest">
                Creator Laboratory is Idle
              </h3>
              <p className="text-zinc-550 max-w-sm text-xs leading-relaxed font-serif italic">
                Provide your core video topic or research angle on the left form and click "Decrypt Parameters". Immersive, SEO-optimized metadata will generate in seconds.
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
