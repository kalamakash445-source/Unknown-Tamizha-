import React, { useState } from 'react';
import { Mail, Clock, MapPin, Youtube, Instagram, Twitter, Send, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate responsive network delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
      
      // Auto dismiss success toast
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-12">
      
      {/* HEADER ROW */}
      <div className="text-center space-y-3">
        <span className="text-[10px] bg-mystery-red/10 border border-[#8e1b1b]/30 rounded px-2.5 py-1 text-mystery-red font-mono font-bold tracking-widest uppercase">
          CHANNELS & COMMUNICATION
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-widest uppercase">
          Contact Portfolio
        </h1>
        <p className="text-zinc-500 text-xs italic font-serif">
          Have an unexplained mystery, ancient text suggestions, or feedback? Send me a secure message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start border-t border-zinc-900 pt-12">
        
        {/* LEFT COLUMN: BRAND HANDLES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-[#0c0c0f] border border-zinc-850 rounded-xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
              Official Inquiries
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <Mail className="h-4 w-4 text-mystery-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-300 font-bold">Email Address</p>
                  <p className="text-zinc-500 mt-0.5 select-all">research@unknown-tamizha.com</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock className="h-4 w-4 text-mystery-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-300 font-bold">Inquiry Active Hours</p>
                  <p className="text-zinc-500 mt-0.5">Mon - Sat, 10:00 AM - 06:00 PM (IST)</p>
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="h-4 w-4 text-mystery-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-zinc-300 font-bold">Studio Base</p>
                  <p className="text-zinc-500 mt-0.5">Chennai, Tamil Nadu, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* SOCIAL HANDLES PANEL */}
          <div className="p-6 bg-[#0c0c0f] border border-zinc-850 rounded-xl space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-900 pb-2">
              Social Outlets
            </h3>
            
            <div className="grid grid-cols-3 gap-2.5 text-center text-zinc-400 text-[10px] font-bold">
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-black/60 rounded-lg border border-zinc-900 hover:border-[#c4302b] hover:text-white transition-all flex flex-col items-center justify-center space-y-1.5"
              >
                <Youtube className="h-5 w-5 text-[#c4302b]" />
                <span>YOUTUBE</span>
              </a>

              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-black/60 rounded-lg border border-zinc-900 hover:border-[#e1306c] hover:text-white transition-all flex flex-col items-center justify-center space-y-1.5"
              >
                <Instagram className="h-5 w-5 text-[#e1306c]" />
                <span>INSTAGRAM</span>
              </a>

              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 bg-black/60 rounded-lg border border-zinc-900 hover:border-[#1da1f2] hover:text-white transition-all flex flex-col items-center justify-center space-y-1.5"
              >
                <Twitter className="h-5 w-5 text-[#1da1f2]" />
                <span>TWITTER</span>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RICH CONTACT FORM */}
        <div className="lg:col-span-3 bg-[#08080a] border border-zinc-850 p-6 rounded-xl relative">
          
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 bg-[#08080a] p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-4 z-40"
              >
                <CheckCircle2 className="h-12 w-12 text-green-500 animate-bounce" />
                <h3 className="font-display text-lg font-black text-white tracking-widest uppercase">
                  Message Dispatched!
                </h3>
                <p className="text-zinc-400 font-serif italic text-xs max-w-sm leading-relaxed">
                  Thank you! Your message was successfully sent to my investigative registry. I will review and reply shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-zinc-900 hover:bg-zinc-850 text-xs font-semibold text-mystery-gold py-1.5 px-4 rounded border border-zinc-800 cursor-pointer"
                >
                  Write New Message
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4.5">
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-zinc-900 pb-2 flex items-center space-x-1.5">
              <span>Secure Mailer Terminal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-455 uppercase tracking-widest font-bold">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Arthur"
                  className="w-full bg-[#111115] border border-zinc-800 focus:border-mystery-gold rounded-lg py-2 px-3 text-xs text-zinc-300 outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-455 uppercase tracking-widest font-bold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., arthur@gmail.com"
                  className="w-full bg-[#111115] border border-zinc-800 focus:border-mystery-gold rounded-lg py-2 px-3 text-xs text-zinc-300 outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-455 uppercase tracking-widest font-bold">Inquiry Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#111115] border border-zinc-800 focus:border-mystery-gold rounded-lg py-2 px-3 text-xs text-zinc-300 outline-none"
              >
                <option value="suggestion">New Occult/History Investigation Suggestion</option>
                <option value="feedback">Website Review / Feedback</option>
                <option value="collab">Business Inquiry / Collaboration</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-455 uppercase tracking-widest font-bold">Message Content</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Briefly outline the historical mystery, folklore, or collaboration proposal you want to discuss..."
                className="w-full bg-[#111115] border border-zinc-800 focus:border-mystery-gold rounded-lg py-2.5 px-3 h-28 text-xs text-zinc-300 outline-none resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-mystery-red to-mystery-red border border-mystery-gold/20 hover:border-mystery-gold hover:from-[#bf2121] py-3 rounded-lg text-white text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40 select-none flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Sending message...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Message</span>
                </>
              )}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};
