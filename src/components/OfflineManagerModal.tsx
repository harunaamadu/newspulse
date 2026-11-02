import React from 'react';
import { X, Bookmark, WifiOff, Trash2, ArrowRight, HardDrive, CheckCircle2 } from 'lucide-react';
import { Article } from '../types';
import { formatEditorialDate } from '../utils/newsUtils';

interface OfflineManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onRemoveFromOffline: (articleId: string, e: React.MouseEvent) => void;
  onClearAllOffline: () => void;
  isSimulatedOffline: boolean;
  onToggleSimulatedOffline: () => void;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  isOpen,
  onClose,
  savedArticles,
  onSelectArticle,
  onRemoveFromOffline,
  onClearAllOffline,
  isSimulatedOffline,
  onToggleSimulatedOffline,
}) => {
  if (!isOpen) return null;

  // Approximate storage calculation
  const approximateStorageKb = Math.round(JSON.stringify(savedArticles).length / 1024);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-end p-0 sm:p-4 md:p-6 overflow-hidden">
      <div className="bg-white dark:bg-stone-900 w-full sm:max-w-md h-full sm:h-auto sm:max-h-[85vh] border-l sm:border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-stone-800 dark:text-stone-200" />
            <h3 className="font-editorial-headline text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
              Offline Reading Library
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            aria-label="Close offline library"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Mode Simulator Toggle Bar */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950/80 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <div className="pr-4">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block font-sans">
                Simulate Offline Disconnection
              </span>
              <span className="text-[11px] text-stone-500 font-sans">
                Test offline reading without cutting your device Wi-Fi
              </span>
            </div>
            <button
              onClick={onToggleSimulatedOffline}
              className={`px-3 py-1.5 text-[11px] font-sans font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-1.5 ${
                isSimulatedOffline
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>{isSimulatedOffline ? 'Offline ON' : 'Go Offline'}</span>
            </button>
          </div>
        </div>

        {/* Storage footprint bar */}
        <div className="px-4 py-2 bg-stone-100/60 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs font-sans text-stone-500">
          <div className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-stone-400" />
            <span>
              {savedArticles.length} {savedArticles.length === 1 ? 'story' : 'stories'} ({approximateStorageKb} KB)
            </span>
          </div>

          {savedArticles.length > 0 && (
            <button
              onClick={onClearAllOffline}
              className="text-stone-500 hover:text-red-600 dark:hover:text-red-400 text-[11px] flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Library</span>
            </button>
          )}
        </div>

        {/* Saved Articles List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/60">
          {savedArticles.length === 0 ? (
            <div className="py-16 text-center text-stone-500 p-6">
              <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-sans font-medium">No offline articles saved yet</p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                Click the bookmark icon on any headline or inside an article to save it for reading during transit or flights.
              </p>
            </div>
          ) : (
            savedArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => {
                  onSelectArticle(article);
                  onClose();
                }}
                className="p-4 hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer transition-colors group flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-stone-500 font-sans mb-1">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatEditorialDate(article.publishedAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime}m read</span>
                  </div>

                  <h4 className="font-editorial-headline text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-blue-900 dark:group-hover:text-blue-400 leading-snug mb-1">
                    {article.title}
                  </h4>

                  <p className="font-editorial-body text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-sans">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Cached locally for offline reading</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0 pt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromOffline(article.id, e);
                    }}
                    className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors"
                    title="Remove from offline"
                    aria-label={`Remove ${article.title} from offline`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
