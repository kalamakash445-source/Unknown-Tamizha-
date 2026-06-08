import React, { useState } from 'react';
import { Sparkles, Copy, Download, RefreshCw, Check, BookOpen, AlertTriangle } from 'lucide-react';

export const AiGeneratorView: React.FC = () => {
  const [category, setCategory] = useState("ancient-secrets");
  const [length, setLength] = useState("medium");
  const [keywords, setKeywords] = useState("");
  const [customSetting, setCustomSetting] = useState("");
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Mysterious historical loading steps in English
  const loadingSteps = [
    "Brushing dust off forgotten stone tablets...",
    "Scanning subterranean temple vaults...",
    "Decoding cryptic medieval alchemical equations...",
    "Collating reports of paranormal frequencies...",
    "Aligning cosmic coordinates of legendary sites..."
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setStory(null);
    setLoadingStep(0);

    // Dynamic loading steps carousel
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2800);

    try {
      const response = await fetch("/api/gemini/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, length, keywords, customSetting }),
      });

      const data = await response.json();
      if (response.ok && data.story) {
        setStory(data.story);
      } else {
        throw new Error(data.error || "Failed to draft AI response.");
      }
    } catch (err: any) {
      console.error(err);
      setStory(`#### Error Occurred\n\nApologies! An issue occurred while contacting the AI Storyteller. Please check your Gemini API configuration and network connection.\n\nError details: ${err.message || err}`);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!story) return;
    navigator.clipboard.writeText(story).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    if (!story) return;
    const element = document.createElement("a");
    const file = new Blob([story], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `unknown-tamizha-${category}-story.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const categories = [
    { id: 'ancient-secrets', label: 'Ancient Secrets' },
    { id: 'mystery', label: 'Mystery & Enigma' },
    { id: 'horror', label: 'Spooky Horror' },
    { id: 'history', label: 'Lost History' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8 space-y-8">
      
      {/* HEADER SECTION */}
      <div className="space-y-1">
        <span className="text-[10px] bg-mystery-gold/10 border border-mystery-gold/30 rounded px-2 py-0.5 uppercase tracking-widest font-mono text-mystery-gold font-bold">
          CO-CREATOR INTELLECTUAL ENGINE
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-widest uppercase text-white">
          AI Story Generator
        </h1>
        <p className="text-zinc-500 text-xs italic font-serif">
          Generate professional mystery and chilling horror chronicles powered by Gemini 3.5 AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* LEFT COLUMN: CONTROL INPUTS FORM */}
        <div className="lg:col-span-2 bg-[#0c0c0f] border border-zinc-850 p-6 rounded-xl space-y-6 h-fit h-full">
          <div className="flex items-center space-x-2 border-b border-zinc-900 pb-3">
            <Sparkles className="h-4 w-4 text-mystery-gold" />
            <h2 className="font-display font-black text-sm text-zinc-100 tracking-wide uppercase">
              Story Configuration Specs
            </h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            
            {/* CATEGORY KNOB */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Story Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#111115] border border-zinc-800 focus:border-mystery-gold rounded-lg py-2.5 px-3 text-xs text-zinc-300 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* LENGTH SELECTOR */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold mb-1 block">
                Story Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'short', label: 'Short', words: '300w' },
                  { id: 'medium', label: 'Medium', words: '600w' },
                  { id: 'long', label: 'Detailed', words: '1200w' }
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLength(l.id)}
                    className={`py-2 px-3 border rounded-lg text-xs font-semibold tracking-wide flex flex-col items-center justify-center transition-all ${
                      length === l.id
                        ? 'bg-mystery-red/15 text-white border-mystery-gold'
                        : 'bg-[#111115] hover:bg-zinc-900 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[9px] opacity-60 font-mono mt-0.5">{l.words}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* KEYWORDS INPUT */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Research Keywords & Clues
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., forgotten vault, copper plates, alchemy formula"
                className="w-full bg-[#111115] border border-zinc-805 rounded-lg py-2.5 px-3 text-xs text-zinc-300 outline-none focus:border-mystery-gold/50"
              />
              <p className="text-[9px] text-zinc-500 font-serif italic">
                Provide specific artifacts, names, or events to guide the narrative style.
              </p>
            </div>

            {/* CUSTOM SETTING */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Custom Plot Elements & Backstory
              </label>
              <textarea
                value={customSetting}
                onChange={(e) => setCustomSetting(e.target.value)}
                placeholder="e.g., A secluded mountain-top fortress during a heavy solar storm..."
                className="w-full bg-[#111115] border border-zinc-805 rounded-lg py-2.5 px-3 h-20 text-xs text-zinc-300 outline-none focus:border-mystery-gold/50 resize-none"
              />
            </div>

            {/* SUBMIT TRIGGER */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-mystery-red to-mystery-red hover:from-[#bf2121] border border-mystery-gold/20 hover:border-mystery-gold rounded-lg text-white font-black py-3 px-4 text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center space-x-2 shadow-lg red-glow cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Engineering...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate Story</span>
                </>
              )}
            </button>

          </form>

        </div>

        {/* RIGHT COLUMN: STORIES OUTPUT PANE */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-[#08080a] border border-zinc-850 p-6 rounded-xl relative min-h-[480px]">
          
          {/* STATIC DECORATOR BACKGROUND BARS */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-mystery-gold/2 blur-[100px] rounded-full pointer-events-none" />

          {/* ACTIVE CONTENT CHECK BLOCK */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative">
                <div className="h-10 w-10 border-4 border-mystery-red/30 border-t-mystery-gold rounded-full animate-spin" />
                <Sparkles className="h-4 w-4 text-mystery-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <p className="text-zinc-400 font-serif italic text-xs animate-pulse max-w-sm">
                "{loadingSteps[loadingStep]}"
              </p>
              <span className="text-[10px] text-zinc-650 font-mono tracking-widest uppercase">
                SECURE TELEMETRY LINK ESTABLISHED
              </span>
            </div>
          ) : story ? (
            
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              {/* INTERACTION CONTROLS ROW */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center space-x-1 text-xs text-zinc-400 font-semibold uppercase">
                  <BookOpen className="h-3.5 w-3.5 text-mystery-gold" />
                  <span>Drafted Chronicle File</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-white transition-all flex items-center space-x-1 text-[10px] cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-green-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Story</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-md bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-white transition-all flex items-center space-x-1 text-[10px] cursor-pointer"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download TXT</span>
                  </button>
                </div>
              </div>

              {/* READ STORY CONTAINER ACCENT */}
              <div className="flex-1 max-h-[380px] overflow-y-auto bg-black/40 p-4 rounded-lg border border-zinc-900 leading-relaxed text-zinc-300 font-sans select-text whitespace-pre-wrap text-sm">
                {story}
              </div>

              <div className="p-3 bg-[#111115] border border-zinc-850/80 rounded-lg flex items-center space-x-3 text-[10px] text-zinc-500 leading-relaxed font-serif">
                <AlertTriangle className="h-3.5 w-3.5 text-mystery-gold shrink-0" />
                <span>
                  Note: This narrative artifact has been fully draft-engineered by AI. Click &quot;Download TXT&quot; to save this manuscript file locally.
                </span>
              </div>

            </div>

          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-3 text-center border-2 border-dashed border-zinc-900 rounded-xl p-8 bg-zinc-950/10">
              <Sparkles className="h-10 w-10 text-zinc-700 animate-pulse" />
              <h3 className="font-display text-sm font-bold text-zinc-400 uppercase tracking-widest">
                Chronicle Terminal is Idle
              </h3>
              <p className="text-zinc-550 max-w-sm text-xs leading-relaxed font-serif italic">
                Configure your story plot features on the left control panel and select &quot;Generate Story&quot; to draft unique historical enigmas in real time.
              </p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
