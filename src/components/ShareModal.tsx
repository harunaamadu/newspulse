import React, { useState } from 'react';
import { X, Copy, Check, Share2, Mail, MessageCircle } from 'lucide-react';
import { Article } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, article }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/#article-${article.id}` : '';
  const shareTitle = article.title;
  const shareText = `${article.title} — via NewsPulse`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: article.excerpt,
          url: currentUrl,
        });
      } catch (err) {
        // user cancelled or failed
      }
    } else {
      handleCopyLink();
    }
  };

  const shareLinks = [
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`,
      icon: <MessageCircle className="w-4 h-4" />,
    },
    {
      name: 'Email Dispatch',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(article.excerpt + '\n\nRead more at: ' + currentUrl)}`,
      icon: <Mail className="w-4 h-4" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-5">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <h3 className="font-editorial-headline text-lg font-bold text-stone-900 dark:text-stone-100">
              Share Editorial Dispatch
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            aria-label="Close share dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="font-editorial-headline text-sm font-bold text-stone-900 dark:text-stone-100 mb-4 line-clamp-2">
          "{article.title}"
        </p>

        {/* Copy Link Input Bar */}
        <div className="mb-5">
          <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-sans font-bold mb-1.5">
            Direct Broadsheet Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 px-3 py-2 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-sm text-stone-700 dark:text-stone-300 font-mono truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 text-xs font-sans font-semibold rounded-sm transition-colors flex items-center gap-1.5 shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Network Share Buttons */}
        <div className="space-y-2">
          <label className="block text-[11px] uppercase tracking-wider text-stone-500 font-sans font-bold mb-1.5">
            Share Across Networks
          </label>
          <div className="grid grid-cols-2 gap-2">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2.5 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 rounded-sm text-xs font-sans font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
              >
                <span className="text-stone-600 dark:text-stone-400">{link.icon}</span>
                <span>{link.name}</span>
              </a>
            ))}

            <button
              onClick={handleNativeShare}
              className="flex items-center gap-2.5 px-3 py-2.5 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 rounded-sm text-xs font-sans font-medium text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors col-span-2 justify-center"
            >
              <Share2 className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <span>More Sharing Options (System Dialog)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
