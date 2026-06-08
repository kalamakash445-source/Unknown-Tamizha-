import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Comment } from '../types';
import { Send, Trash2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommentSectionProps {
  storyId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ storyId }) => {
  const { user, isAdmin, loginWithGoogle, addComment, deleteComment, getCommentsForStory } = useApp();
  const [comments, setComments] = useState<Comment[]>([]);
  const isGuest = !user || user.uid.startsWith('guest_');
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Return real-time listener subscription
    const unsubscribe = getCommentsForStory(storyId, (fetchedComments) => {
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [storyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(storyId, newComment);
      setNewComment("");
    } catch (err) {
      console.error("Comment submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(id);
      } catch (err) {
        console.error("Comment delete error:", err);
      }
    }
  };

  return (
    <div className="mt-8 border-t border-zinc-850 pt-8">
      <h3 className="font-display text-lg font-bold text-zinc-200 tracking-wide mb-6">
        Discussion & Theory Board ({comments.length})
      </h3>

      {/* COMMENTING PERMISSION FORM */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div className="flex gap-3">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user?.displayName || "User"}
              className="h-9 w-9 rounded-full border border-zinc-800"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-mystery-gold">
              {user?.displayName?.charAt(0) || "U"}
            </div>
          )}
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts or theories on this mystery? Write here..."
              className="w-full bg-[#111115] border border-zinc-800 focus:border-mystery-gold/50 text-zinc-200 text-xs py-2.5 px-3 rounded-lg outline-none resize-none h-20 transition-all focus:shadow-[0_0_15px_rgba(197,168,106,0.05)]"
              maxLength={500}
              required
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-zinc-500">{newComment.length}/500 characters</span>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-mystery-red to-mystery-red/80 hover:from-mystery-crimson hover:to-mystery-red border border-mystery-red/50 text-white font-bold text-xs py-1.5 px-4 rounded-md transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-3 w-3" />
                    <span>Post Theory</span>
                  </>
                )}
              </button>
            </div>
            {isGuest && (
              <p className="text-[10px] text-zinc-555 mt-2 font-mono italic">
                Currently participating as a Guest Explorer.{" "}
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="text-mystery-gold hover:text-white hover:underline focus:outline-none font-bold"
                >
                  Sign In with Google
                </button>{" "}
                to sync details.
              </p>
            )}
          </div>
        </div>
      </form>

      {/* COMMENTS FEED LIST */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        <AnimatePresence>
          {comments.length === 0 ? (
            <p className="text-zinc-500 font-serif italic text-xs py-4 text-center">
              No theories shared yet. Be the first to share your investigative theory!
            </p>
          ) : (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3.5 rounded-lg bg-[#0e0e11] border border-zinc-850/60 hover:border-zinc-800 transition-all flex gap-3 group relative"
              >
                {comment.userPhoto ? (
                  <img
                    src={comment.userPhoto}
                    alt={comment.userName}
                    className="h-8 w-8 rounded-full border border-zinc-800"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-mystery-gold">
                    {comment.userName.charAt(0)}
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-zinc-300">{comment.userName}</span>
                      {comment.userId === "kalam172010" || comment.userName === "Unknown Tamizha" ? (
                        <span className="text-[9px] uppercase tracking-widest font-bold bg-[#8e1b1b]/20 text-mystery-red border border-[#8e1b1b]/30 px-1 rounded flex items-center gap-0.5">
                          <ShieldAlert className="h-2 w-2" /> Creator
                        </span>
                      ) : null}
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-zinc-400 mt-1.5 text-xs whitespace-pre-wrap leading-relaxed">
                    {comment.commentText}
                  </p>
                </div>

                {/* DELETE BUTTON GATED FOR OWNERS & ADMINS */}
                {(user && (user.uid === comment.userId || isAdmin)) && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="absolute right-3.5 bottom-3.5 p-1 rounded hover:bg-zinc-850 text-zinc-600 hover:text-mystery-red opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                    title="Delete Comment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
