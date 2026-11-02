import React from 'react';
import { AlertCircle, X, ArrowRight, Bell } from 'lucide-react';
import { PushNotification } from '../types';

interface PushToastProps {
  notification: PushNotification | null;
  onClose: () => void;
  onReadArticle: (articleId?: string) => void;
}

export const PushToast: React.FC<PushToastProps> = ({
  notification,
  onClose,
  onReadArticle,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed top-14 right-4 z-50 max-w-sm sm:max-w-md w-full bg-stone-900 text-stone-100 dark:bg-stone-950 border border-stone-700 dark:border-stone-800 shadow-2xl p-4 rounded-sm animate-in slide-in-from-top-4 duration-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="p-1 bg-red-600 text-white rounded-xs">
            <Bell className="w-3.5 h-3.5" />
          </span>
          <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-red-400">
            {notification.priority === 'breaking' ? 'BREAKING NEWS ALERT' : 'TRENDING PULSE'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white p-1"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <h4 className="font-editorial-headline text-sm sm:text-base font-bold text-white leading-snug mb-1">
        {notification.title}
      </h4>

      <p className="font-sans text-xs text-stone-300 line-clamp-2 leading-relaxed mb-3">
        {notification.body}
      </p>

      <div className="flex items-center justify-between text-xs font-sans pt-2 border-t border-stone-800">
        <span className="text-[11px] text-stone-400">Pushed just now</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="text-[11px] text-stone-400 hover:text-white"
          >
            Dismiss
          </button>
          {notification.articleId && (
            <button
              onClick={() => {
                onReadArticle(notification.articleId);
                onClose();
              }}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xs flex items-center gap-1 text-[11px]"
            >
              <span>Read Story</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
