import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Shield, AlertTriangle, Send } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { subscribeToNewsletter } = useApp();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ success: false, message: "" });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setFeedback({ success: false, message: "" });
    
    try {
      const res = await subscribeToNewsletter(email);
      setFeedback(res);
      if (res.success) {
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setFeedback({ success: false, message: "சந்தா பதிவிடுவதில் தோல்வி. மீண்டும் முயலவும்." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative mt-20 border-t border-zinc-850 bg-black/80 backdrop-blur-md text-zinc-400 py-12 px-6 lg:px-12">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-mystery-red/5 pointer-events-none" />
      <div className="mx-auto max-w-7xl relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-zinc-900 pb-10">
          
          {/* COL 1: BRAND DETAIL */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex cursor-pointer items-center space-x-3" onClick={() => setActiveTab('home')}>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-mystery-red to-black border border-mystery-gold/30">
                <span className="font-display font-black text-lg text-mystery-gold">U</span>
              </div>
              <h2 className="font-display text-base font-bold tracking-widest text-white">UNKNOWN TAMIZHA</h2>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-zinc-500">
              தமிழின் அடியில் புதைந்திருக்கும் ஆச்சரியங்கள், பழங்கால மர்மங்கள், அரசர்களின் ரகசிய புதையல்கள், மற்றும் திகில் நிகழ்வுகளின் உண்மை பின்னணிகளை ஆராய்ந்து உரையாடும் தமிழின் முதல் தர மர்ம களம்.
            </p>
            <div className="flex items-center space-x-3.5 pt-2">
              <span className="text-[10px] uppercase font-mono tracking-wider bg-zinc-900/60 border border-zinc-850 px-2 py-0.5 rounded text-mystery-gold">
                Netflix Style Vibe
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider bg-[#8e1b1b]/20 border border-[#8e1b1b]/30 px-2 py-0.5 rounded text-mystery-red">
                History Channel Certified
              </span>
            </div>
          </div>

          {/* COL 2: LINKS */}
          <div className="space-y-3">
            <h3 className="text-zinc-200 font-display text-xs font-bold uppercase tracking-wider">வழிகாட்டி (Navigation)</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-mystery-gold transition-colors">முகப்பு (Home)</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('stories')} className="hover:text-mystery-gold transition-colors">மர்ம கதைகள் (Stories)</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('ai-generator')} className="hover:text-mystery-gold transition-colors">AI தமிழ் கதைகள்</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('creator-tools')} className="hover:text-mystery-gold transition-colors">யூடியூப் கருவிகள்</button>
              </li>
            </ul>
          </div>

          {/* COL 3: NEWSLETTER */}
          <div className="space-y-4">
            <h3 className="text-zinc-200 font-display text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5Col">
              <Mail className="h-3.5 w-3.5 text-mystery-gold" />
              <span>மடல் சந்தா (Newsletter)</span>
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              புதிய உண்மைச் சம்பவங்கள் மற்றும் கதைகள் பதிவேற்றப்படும் போது உடனடியாக மின்னஞ்சல் வழியாக அறிய சந்தாதாரர் ஆகுங்கள்.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="உங்களுக்கு மின்னஞ்சல்..."
                className="w-full bg-zinc-900/60 border border-zinc-800 text-xs px-3 py-2 rounded focus:outline-none focus:border-mystery-gold text-zinc-200"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-mystery-red hover:bg-mystery-crimson border border-mystery-red/30 text-white p-2 rounded cursor-pointer transition-all active:scale-95 flex items-center justify-center min-w-[36px]"
              >
                {loading ? (
                  <div className="h-4.5 w-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </form>
            {feedback.message && (
              <p className={`text-[10px] ${feedback.success ? 'text-green-500' : 'text-mystery-red'} mt-1 font-medium`}>
                {feedback.message}
              </p>
            )}
          </div>

        </div>

        {/* BOTTOM LEGAL ROW */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-zinc-600 text-[10px] gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-3 w-3 text-mystery-gold/50" />
            <span>© {new Date().getFullYear()} Unknown Tamizha. All Rights Preserved.</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('about')} className="hover:text-zinc-400 transition-colors">அறிமுகம்</button>
            <span>•</span>
            <button onClick={() => setActiveTab('contact')} className="hover:text-zinc-400 transition-colors">தொடர்புகொள்ள</button>
            <span>•</span>
            <span className="flex items-center space-x-1 text-zinc-600">
              <AlertTriangle className="h-2.5 w-2.5 text-mystery-red" />
              <span>சித்தாந்த ஆராய்ச்சி களம்</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
