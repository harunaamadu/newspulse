import React from 'react';
import { X, Bell, Check, Sparkles, AlertTriangle, ArrowRight, Volume2 } from 'lucide-react';
import { PushNotification, Article } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSimulatePushAlert: () => void;
  onSelectArticleById: (articleId?: string) => void;
  onRequestBrowserPermission: () => void;
  browserPermission: NotificationPermission | 'unsupported';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onSimulatePushAlert,
  onSelectArticleById,
  onRequestBrowserPermission,
  browserPermission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-end p-0 sm:p-4 md:p-6 overflow-hidden">
      <div className="bg-white dark:bg-stone-900 w-full sm:max-w-md h-full sm:h-auto sm:max-h-[85vh] border-l sm:border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-stone-800 dark:text-stone-200" />
            <h3 className="font-editorial-headline text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
              Push Notification Center
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            aria-label="Close notification panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Simulation & Web Push Controls Bar */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950/80 border-b border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block font-sans">
                Real-Time Push Simulation
              </span>
              <span className="text-[11px] text-stone-500 font-sans">
                Simulate instant global wire bulletin
              </span>
            </div>
            <button
              onClick={onSimulatePushAlert}
              className="px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white text-[11px] font-sans uppercase font-bold tracking-wider rounded-sm transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>Simulate Alert</span>
            </button>
          </div>

          {/* Browser Permission status */}
          <div className="pt-2 border-t border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between text-[11px] font-sans">
            <span className="text-stone-500">
              Web Push API: <strong className="text-stone-700 dark:text-stone-300 capitalize">{browserPermission}</strong>
            </span>
            {browserPermission !== 'granted' && browserPermission !== 'unsupported' && (
              <button
                onClick={onRequestBrowserPermission}
                className="text-blue-900 dark:text-blue-400 font-bold hover:underline"
              >
                Request Permission
              </button>
            )}
          </div>
        </div>

        {/* Action strip */}
        <div className="px-4 py-2 bg-stone-100/60 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs font-sans">
          <span className="text-stone-500">{notifications.length} alerts received</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onMarkAllAsRead}
              className="text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 text-[11px]"
            >
              Mark all read
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={onClearAll}
              className="text-stone-600 dark:text-stone-400 hover:text-red-600 dark:hover:text-red-400 text-[11px]"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/60">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-stone-500 p-6">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-sans font-medium">No alerts right now</p>
              <p className="text-xs text-stone-400 mt-1">
                Click 'Simulate Alert' above to test real-time push delivery
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 transition-colors cursor-pointer group ${
                  notif.read
                    ? 'bg-transparent hover:bg-stone-50 dark:hover:bg-stone-800/40'
                    : 'bg-stone-100/50 dark:bg-stone-800/30 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  if (notif.articleId) {
                    onSelectArticleById(notif.articleId);
                    onClose();
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-sans uppercase font-bold tracking-wider">
                    {notif.priority === 'breaking' ? (
                      <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Breaking
                      </span>
                    ) : (
                      <span className="text-stone-500">{notif.category}</span>
                    )}
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-400 font-normal">{notif.timestamp}</span>
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                  )}
                </div>

                <h4 className="font-editorial-headline text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-blue-900 dark:group-hover:text-blue-400 leading-snug mb-1">
                  {notif.title}
                </h4>

                <p className="font-sans text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2">
                  {notif.body}
                </p>

                {notif.articleId && (
                  <div className="mt-2 text-[11px] text-blue-900 dark:text-blue-400 font-sans font-bold flex items-center gap-1 group-hover:underline">
                    <span>Read Full Dispatch</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
