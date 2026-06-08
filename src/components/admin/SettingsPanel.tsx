import React, { useState } from 'react';
import { Settings, Save, Check, RefreshCw, FileDown, FileUp
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Story } from '../../types';

interface SettingsProps {
  stories: Story[];
  onBackupSuccess?: (msg: string) => void;
}

export const SettingsPanel: React.FC<SettingsProps> = ({ stories, onBackupSuccess }) => {
  // Brand Configuration Form State
  const [siteName, setSiteName] = useState("Unknown Tamizha");
  const [themePreset, setThemePreset] = useState("crimson");
  const [spotifyUrl, setSpotifyUrl] = useState("https://spotify.com/UnknownTamizha");
  const [ytUrl, setYtUrl] = useState("https://youtube.com/@UnknownTamizha");
  const [telegramUrl, setTelegramUrl] = useState("https://t.me/UnknownTamizha");

  // SEO configuration Form State
  const [seoTitle, setSeoTitle] = useState("Unknown Tamizha | தமிழ் மர்மங்கள் மற்றும் வரலாற்று ரகசியங்கள்");
  const [seoDesc, setSeoDesc] = useState("Unknown Tamizha delivers highly researched deep speculation, ancient Tamil alchemical mysteries, siddhars, and Kumari Kandam speculation.");
  const [seoKeywords, setSeoKeywords] = useState("tamil mystery, chola history, siddhar science, navapashanam, unknown tamizha, ancient tamils");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [loadingRestore, setLoadingRestore] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    // Simulate auto-save specs & write properties to localStorage
    localStorage.setItem('unknown_tamizha_site_name', siteName);
    localStorage.setItem('unknown_tamizha_theme_preset', themePreset);
    localStorage.setItem('unknown_tamizha_spotify_url', spotifyUrl);
    localStorage.setItem('unknown_tamizha_yt_url', ytUrl);
    localStorage.setItem('unknown_tamizha_telegram_url', telegramUrl);
    localStorage.setItem('unknown_tamizha_seo_title', seoTitle);
    localStorage.setItem('unknown_tamizha_seo_desc', seoDesc);
    localStorage.setItem('unknown_tamizha_seo_keywords', seoKeywords);

    setTimeout(() => {
      setSaving(false);
      setSuccessMsg("System configurations and SEO headers fully calibrated!");
      if (onBackupSuccess) {
        onBackupSuccess("Configurations and SEO indexes saved successfully.");
      }
      setTimeout(() => setSuccessMsg(""), 4500);
    }, 1250);
  };

  // BACKUP FUNCTION: DOWNLOADS FULL JSON
  const handleExportBackup = () => {
    if (stories.length === 0) {
      alert("No archive stories located in memory to generate backups.");
      return;
    }

    const backupData = {
      exportedAt: new Date().toISOString(),
      source: "Unknown Tamizha Cockpit Portal UI",
      stories: stories,
      config: {
        siteName,
        themePreset,
        spotifyUrl,
        ytUrl,
        telegramUrl,
        seoTitle,
        seoDesc,
        seoKeywords
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `unknown_tamizha_full_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (onBackupSuccess) {
      onBackupSuccess("Database JSON exported successfully!");
    }
  };

  // RESTORE FUNCTION: UPLOADS FILES & PARSES TO FIRESTORE
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoadingRestore(true);
    fileReader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.stories || !Array.isArray(parsed.stories)) {
          throw new Error("Invalid schema structure. Must contain stories catalog node.");
        }

        const storiesToInoculate: Story[] = parsed.stories;
        let count = 0;

        // Loop and write documents securely to Firebase Firestore
        for (const story of storiesToInoculate) {
          if (!story.title || !story.content) continue;
          
          const finalId = story.id || `story-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const storyDocRef = doc(db, 'stories', finalId);
          
          await setDoc(storyDocRef, {
            title: story.title,
            subtitle: story.subtitle || "",
            category: story.category || "mystery",
            readsCount: story.readsCount || 0,
            creatorName: story.creatorName || "Unknown Tamizha",
            isTrending: story.isTrending || false,
            thumbnail: story.thumbnail || "",
            content: story.content,
            createdAt: story.createdAt || new Date().toISOString()
          }, { merge: true });

          count++;
        }

        // Restore accompanying setups if present
        if (parsed.config) {
          const cfg = parsed.config;
          if (cfg.siteName) setSiteName(cfg.siteName);
          if (cfg.themePreset) setThemePreset(cfg.themePreset);
          if (cfg.spotifyUrl) setSpotifyUrl(cfg.spotifyUrl);
          if (cfg.ytUrl) setYtUrl(cfg.ytUrl);
          if (cfg.telegramUrl) setTelegramUrl(cfg.telegramUrl);
          if (cfg.seoTitle) setSeoTitle(cfg.seoTitle);
          if (cfg.seoDesc) setSeoDesc(cfg.seoDesc);
          if (cfg.seoKeywords) setSeoKeywords(cfg.seoKeywords);
        }

        setLoadingRestore(false);
        alert(`Successfully injected ${count} legacy stories back into remote Firestore Collections! Registry refresh in progress.`);
        
        if (onBackupSuccess) {
          onBackupSuccess(`Parsed and restored ${count} stories successfully from JSON backup.`);
        }
      } catch (err: any) {
        setLoadingRestore(false);
        console.error(err);
        alert(`Backup parser crashed: ${err?.message || "Invalid JSON or network constraints"}`);
      }
    };

    fileReader.readAsText(files[0]);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* SUCCESS ALERTS */}
      {successMsg && (
        <div className="p-3 bg-green-950/20 border border-green-800 text-green-400 text-xs font-mono rounded-xl">
          ✦ {successMsg}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* BRAND & SOCIAL SETTINGS COLUMN: 7 COLS */}
        <div className="lg:col-span-7 bg-[#0b0b0e] border border-zinc-900 rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-2 border-b border-zinc-950 pb-3">
            <Settings className="h-4 w-4 text-mystery-gold animate-spin-slow" />
            <h4 className="font-display font-black text-xs text-white tracking-widest uppercase">
              COCKPIT PREFERENCES & BRAND METRICS
            </h4>
          </div>

          <div className="space-y-4">
            {/* SITE NAME TEXTBOX */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                Website Portal Name
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2.5 px-3 text-white"
              />
            </div>

            {/* THEME PRESET DROPDOWN */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">
                Theme Accent Color Mode
              </label>
              <select
                value={themePreset}
                onChange={(e) => setThemePreset(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2.5 px-3 text-white"
              >
                <option value="crimson">Crimson Shroud (Goth Maroon & Gold Accents)</option>
                <option value="gold">Golden Obsidian (Deep Charcoal & Royal Gold)</option>
                <option value="emerald">Siddhar Emerald (Bio-Mysterious Ancient Green)</option>
                <option value="abyss">Ocean Abysm (Shattered Underwater Deep Blue)</option>
              </select>
            </div>

            <div className="border-t border-zinc-950 pt-4 space-y-4">
              <span className="text-[10px] font-mono text-zinc-550 font-black uppercase tracking-widest block">CREATOR SOCIAL LINKS</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* YT LINK */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">YouTube Channel URL</label>
                  <input
                    type="url"
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2.5 px-3 text-zinc-300 font-mono"
                  />
                </div>

                {/* SPOTIFY LINK */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">Spotify Podcast URL</label>
                  <input
                    type="url"
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2.5 px-3 text-zinc-300 font-mono"
                  />
                </div>

                {/* TELEGRAM LINK */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block">Telegram Group Channels URL</label>
                  <input
                    type="url"
                    value={telegramUrl}
                    onChange={(e) => setTelegramUrl(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-xs py-2.5 px-3 text-zinc-300 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-mystery-red to-[#bf2121] select-none text-white font-black text-xs py-2 px-6 rounded-lg transition uppercase tracking-widest border border-mystery-gold/15 hover:border-mystery-gold flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 hover:shadow-lg"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saving ? "SAVING MATRIX..." : "COMMIT GENERAL SPECS"}</span>
              </button>
            </div>

          </div>
        </div>

        {/* SEO CONFIGS & POWER BACKUPS COLUMN: 5 COLS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SEO DECK */}
          <div className="bg-[#0b0b0e] border border-zinc-900 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-mono font-black text-white tracking-widest uppercase border-b border-zinc-950 pb-2">
              SEO SPECIFICATIONS METRICS
            </h4>

            <div className="space-y-3.5">
              {/* PAGE INDEXING TITLE */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase font-bold text-zinc-400">Meta Title Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-[11px] py-2 px-3 text-zinc-200"
                />
              </div>

              {/* META DESCRIPTION */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase font-bold text-zinc-400">Meta description</label>
                <textarea
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-[11px] py-1.5 px-3 h-16 text-zinc-350 resize-none font-serif leading-relaxed"
                />
              </div>

              {/* KEYWORDS */}
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase font-bold text-zinc-400">Core Search Keywords</label>
                <input
                  type="text"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 focus:border-mystery-gold outline-none rounded-lg text-[11px] py-2 px-3 text-zinc-350 font-mono"
                />
              </div>
            </div>
          </div>

          {/* BACKUP & RESTORE MODULE */}
          <div className="bg-[#0b0b0e] border border-zinc-900 rounded-2xl p-6 space-y-4">
            <h4 className="text-xs font-mono font-black text-white tracking-widest uppercase border-b border-zinc-950 pb-2">
              FIRESTORE CLOUD REPLICATOR BACKUPS
            </h4>
            <p className="text-[11px] text-zinc-500 font-serif leading-relaxed">
              Export all chronicles as raw backup schemas or upload earlier JSON backup files to merge with Google Cloud Firestore collections directly.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* DOWNLOAD BUTTON */}
              <button
                type="button"
                onClick={handleExportBackup}
                className="p-2.5 rounded-lg border border-zinc-900 hover:border-mystery-gold/40 text-zinc-400 hover:text-mystery-gold transition-colors text-xs font-mono font-black flex flex-col items-center justify-center space-y-1.5 cursor-pointer bg-zinc-950/20 active:scale-95 text-center select-none"
              >
                <FileDown className="h-5 w-5 text-mystery-gold" />
                <span>BACKUP DATABASE</span>
              </button>

              {/* RESTORE Uploader CONTAINER */}
              <div className="relative">
                <input
                  type="file"
                  id="backup-restore-uploader"
                  accept=".json"
                  disabled={loadingRestore}
                  onChange={handleImportBackup}
                  className="hidden"
                />
                <label
                  htmlFor="backup-restore-uploader"
                  className="p-2.5 rounded-lg border border-zinc-900 hover:border-mystery-red/40 text-zinc-400 hover:text-mystery-red transition-colors text-xs font-mono font-black flex flex-col items-center justify-center space-y-1.5 cursor-pointer bg-zinc-950/20 active:scale-95 text-center select-none h-full"
                >
                  {loadingRestore ? (
                    <RefreshCw className="h-5 w-5 text-mystery-red animate-spin" />
                  ) : (
                    <FileUp className="h-5 w-5 text-mystery-red" />
                  )}
                  <span>{loadingRestore ? "INJECTING..." : "RESTORE PORTAL"}</span>
                </label>
              </div>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};
