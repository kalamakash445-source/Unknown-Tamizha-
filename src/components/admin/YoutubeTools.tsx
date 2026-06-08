import React, { useState } from 'react';
import { Video, Copy, Check, Sparkles, Hash, FileText } from 'lucide-react';

export const YoutubeTools: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 3000);
  };

  const titleTemplates = [
    {
      id: 'title1',
      tamil: "அழிக்கப்பட்ட குமரிகண்டம்: 5 அதிர்ச்சி உண்மைகள்! 🌊 (The Lost Continent of Kumari Kandam)",
      desc: "High virality template focusing on lost history myths."
    },
    {
      id: 'title2',
      tamil: "சித்தர்களின் விடைபெறாத 9 உலோக ரகசியம்! 🧪 (Mysterious Siddhar Alchemy & Navapashanam)",
      desc: "Perfect hook for ancient secrets & science speculation."
    },
    {
      id: 'title3',
      tamil: "பூமியில் மறைக்கப்படும் அந்த மர்ம வாசல்? பத்மநாபசுவாமி கோவில் ரகசியம்! 🗝️",
      desc: "Classic temple mystery targeting divine anomalies."
    },
    {
      id: 'title4',
      tamil: "அதிர்வு தரும் தனுஷ்கோடி மர்மங்கள்: இரவு நேரத்தில் நடப்பது என்ன? 🚂",
      desc: "High engagement haunted location template."
    }
  ];

  const midjourneyPrompts = [
    {
      id: 'prompt1',
      title: "Kumari Kandam Lost Temple",
      text: "A breathtaking hyper-realistic ruins of a submerged Tamil temple, glowing columns under the deep blue ocean, ancient Tamil letters etched in glowing gold, epic scale, ray tracing, cinematic lighting --ar 16:9 --style raw",
    },
    {
      id: 'prompt2',
      title: "Ancient Alchemist Siddhar",
      text: "An ancient Tamil Siddhar saint inside an old cave, surrounded by glowing mystic chemicals, navapashanam herbs, crafting a multi-colored metallic elixir, dramatic shadow play, photorealistic, 8k resolution --ar 16:9",
    },
    {
      id: 'prompt3',
      title: "Chola Dynasty Golden Portal",
      text: "Massive dark temple inner chamber, a magical golden portal reflecting ancient Tamil symbols, a shadow of a warrior king wearing bronze armor, divine high-fantasy style, golden hour, octane render --ar 16:9"
    }
  ];

  const descriptionTemplate = `மகிழ்ச்சி! இந்த வீடியோவில் தமிழ் வரலாற்றின் மறைக்கப்பட்ட மிக அற்புதமான மர்மங்களை ஆராய்வோம். 

🔔 இதுபோன்ற அதிர்ச்சியூட்டும் மர்மங்களை அறிய இப்போதே சப்ஸ்கிரைப் செய்யவும்!
📌 Join our Telegram: https://t.me/UnknownTamizha
📌 follow on Spotify: https://spoti.fi/UnknownTamizha

TIMESTAMPS:
0:00 - அறிமுகம் (Introduction)
2:15 - மர்மத்தின் ஆரம்பம் (The Genesis of Mystery)
5:40 - ஆதாரங்களின் தேடல் (Searching for Evidence)
11:20 - இறுதி விளக்கம் (Conclusion)

⚠️ DISCLAIMER: This video is for educational and speculative purposes only. All claims are based on historical literature and folk legends.

#UnknownTamizha #TamilMystery #TamilHistory #SiddharSecrets`;

  const dynamicHashtags = [
    { tags: "#UnknownTamizha #TamilHistory #KumariKandam #AncientSecrets #TamilMemes", cat: "General Mystery" },
    { tags: "#SiddharSecrets #TamilAlchemist #Navapashanam #Bhogar #AncientScience", cat: "Siddhar Legends" },
    { tags: "#TamilTemples #TempleSecrets #Padmanabhaswamy #CholaHistory #MysticIndia", cat: "Temples & Ruins" }
  ];

  return (
    <div className="space-y-8 text-left">
      
      {/* HEADER ROW */}
      <div className="p-6 bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-900 rounded-2xl flex items-center justify-between shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Video className="h-4 w-4 text-mystery-red animate-pulse" />
            <h3 className="text-xs font-mono font-black text-white tracking-widest uppercase">
              YOUTUBE VIDEO MARKETING SUITE
            </h3>
          </div>
          <p className="text-zinc-500 font-serif text-[11px] italic mt-0.5">
            Craft high-ctr titles, generate illustrative thumbnail graphics prompts, and copy description structures.
          </p>
        </div>
        <span className="p-1 px-2.5 rounded bg-[#8e1b1b]/10 border border-[#8e1b1b]/30 text-mystery-red text-[8px] font-mono tracking-widest uppercase font-black">
          Creator Hub v2
        </span>
      </div>

      {/* THREE COLS SPLIT */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* TITLE GENERATOR & HASHTAGS (COL 1) */}
        <div className="space-y-6">
          
          {/* S1: HIGH CTR TITLES */}
          <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2.5">
              <Sparkles className="h-4 w-4 text-mystery-gold animate-bounce" />
              <h4 className="text-xs font-mono font-black text-zinc-100 tracking-wider uppercase">
                VIRAL TITLE GENERATOR (TAMIL ONSET)
              </h4>
            </div>

            <div className="space-y-3">
              {titleTemplates.map((item) => (
                <div key={item.id} className="p-3 bg-[#0a0a0d] border border-zinc-900/60 hover:border-mystery-gold/20 rounded-xl transition-all flex items-center justify-between gap-4 group">
                  <div className="space-y-1 truncate">
                    <p className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate cursor-default">
                      {item.tamil}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono italic truncate">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(item.tamil, item.id)}
                    className="p-2 py-1 rounded bg-zinc-900 text-[10px] font-mono text-zinc-400 hover:text-white active:scale-95 transition flex items-center space-x-1 shrink-0 border border-zinc-850 cursor-pointer"
                  >
                    {copiedText === item.id ? (
                      <>
                        <Check className="h-3 w-3 text-green-400" />
                        <span className="text-green-400 font-bold">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>COPY</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* S2: HASHTAG BUNDLES */}
          <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2.5">
              <Hash className="h-4 w-4 text-mystery-red animate-pulse" />
              <h4 className="text-xs font-mono font-black text-zinc-100 tracking-wider uppercase">
                SEO HASHTAG ENSEMBLES
              </h4>
            </div>

            <div className="space-y-3.5">
              {dynamicHashtags.map((h, i) => (
                <div key={i} className="p-3 bg-[#0a0a0d] border border-zinc-900/60 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-400 p-0.5 px-2 rounded">
                      {h.cat}
                    </span>
                    <p className="text-xs font-mono text-mystery-gold tracking-wide mt-1.5">{h.tags}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(h.tags, `hash-${i}`)}
                    className="p-2 py-1 rounded bg-zinc-900 text-[9px] font-mono font-bold text-zinc-400 hover:text-white transition flex items-center space-x-1 shrink-0 border border-zinc-850 cursor-pointer"
                  >
                    {copiedText === `hash-${i}` ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* THUMBNAIL GRAPHIC GENERATOR & DESCRIPTION TEMPLATES (COL 2) */}
        <div className="space-y-6">
          
          {/* S3: THUMBNAIL PROMPT MANAGER */}
          <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-zinc-900 pb-2.5">
              <Sparkles className="h-4 w-4 text-mystery-red" />
              <h4 className="text-xs font-mono font-black text-zinc-100 tracking-wider uppercase">
                MIDJOURNEY THUMBNAIL DIRECTIVES
              </h4>
            </div>

            <div className="space-y-4">
              {midjourneyPrompts.map((p) => (
                <div key={p.id} className="p-4 bg-[#0a0a0d] border border-zinc-900/60 hover:border-zinc-800 rounded-xl space-y-2 transition">
                  <div className="flex justify-between items-center border-b border-zinc-950 pb-1.5">
                    <span className="font-mono text-[10px] font-black text-mystery-gold tracking-wider font-bold">
                      {p.title}
                    </span>
                    <button
                      onClick={() => handleCopy(p.text, p.id)}
                      className="text-[9px] font-mono text-zinc-500 hover:text-white flex items-center space-x-1 border border-zinc-900 p-1 rounded bg-[#030305] px-2 cursor-pointer"
                    >
                      {copiedText === p.id ? (
                        <Check className="h-2.5 w-2.5 text-green-400" />
                      ) : (
                        <Copy className="h-2.5 w-2.5" />
                      )}
                      <span>{copiedText === p.id ? 'COPIED' : 'SPECIFY'}</span>
                    </button>
                  </div>
                  <p className="text-[10px] leading-relaxed text-zinc-400 font-mono select-all">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* S4: UNIVERSAL META DESCRIPTION */}
          <div className="bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl space-y-3 flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-amber-500" />
                <h4 className="text-xs font-mono font-black text-zinc-100 tracking-wider uppercase">
                  METADATA DESCRIPTION ARCHIVE
                </h4>
              </div>
              <button
                onClick={() => handleCopy(descriptionTemplate, 'descTemp')}
                className="text-[9px] bg-mystery-red hover:bg-[#a81a1a] text-white p-1 px-2.5 font-bold font-mono uppercase tracking-widest rounded transition flex items-center space-x-1 cursor-pointer"
              >
                {copiedText === 'descTemp' ? (
                  <Check className="h-3 w-3 text-green-200" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                <span>{copiedText === 'descTemp' ? 'COPIED' : 'COPY SCHEME'}</span>
              </button>
            </div>

            <textarea
              readOnly
              value={descriptionTemplate}
              className="flex-1 w-full min-h-[160px] bg-[#07070a] border border-zinc-900 rounded-xl p-3 text-[10px] leading-relaxed font-mono text-zinc-400 resize-none select-all focus:outline-none"
            />
          </div>

        </div>

      </div>

    </div>
  );
};
