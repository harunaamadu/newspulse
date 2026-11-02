import React, { useState } from 'react';
import {
  Search,
  Moon,
  Sun,
  Bell,
  Bookmark,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Wifi,
  WifiOff,
  SlidersHorizontal,
  ShieldCheck,
} from 'lucide-react';
import { Category, PushNotification, FlashNewsItem } from '../types';
import { FlashNewsCarousel } from './FlashNewsCarousel';

interface HeaderProps {
  currentCategory: Category;
  feedMode: 'all' | 'for-you' | 'trending' | 'saved';
  onSelectCategory: (cat: Category) => void;
  onSelectFeedMode: (mode: 'all' | 'for-you' | 'trending' | 'saved') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenOfflineManager: () => void;
  onOpenPersonalizeModal: () => void;
  onOpenAdminDashboard?: () => void;
  unreadNotificationsCount: number;
  savedOfflineCount: number;
  isSimulatedOffline: boolean;
  flashNews?: FlashNewsItem[];
  onSelectArticleById?: (articleId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  feedMode,
  onSelectCategory,
  onSelectFeedMode,
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  onOpenNotifications,
  onOpenOfflineManager,
  onOpenPersonalizeModal,
  onOpenAdminDashboard,
  unreadNotificationsCount,
  savedOfflineCount,
  isSimulatedOffline,
  flashNews,
  onSelectArticleById,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);

  // Today's formatted broadsheet date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const navItems: { label: string; category?: Category; mode?: 'for-you' | 'trending' | 'saved'; hasMega?: boolean }[] = [
    { label: 'HOME', category: 'all' },
    { label: 'FOR YOU', mode: 'for-you' },
    { label: 'TRENDING', mode: 'trending' },
    { label: 'POLITICS', category: 'politics', hasMega: true },
    { label: 'BUSINESS', category: 'business', hasMega: true },
    { label: 'TECH & AI', category: 'tech', hasMega: true },
    { label: 'WORLD', category: 'world' },
    { label: 'TRAVEL', category: 'travel' },
    { label: 'OPINION', category: 'opinion' },
  ];

  return (
    <header className="w-full bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* 1. TOP FLASH TICKER & UTILITY BAR */}
      <div className="bg-stone-900 dark:bg-black text-stone-200 text-[11px] py-1.5 px-4 sm:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Flash News Carousel */}
          <FlashNewsCarousel
            items={flashNews || []}
            onSelectArticleById={onSelectArticleById}
          />

          {/* Right utilities: Weather & Offline status & Personalize */}
          <div className="hidden md:flex items-center gap-5 shrink-0 text-stone-400">
            <div className="flex items-center gap-1.5">
              <span>London 18°C</span>
              <span aria-hidden="true">·</span>
              <span>New York 21°C</span>
            </div>

            <div className="flex items-center gap-1.5">
              {isSimulatedOffline ? (
                <span className="flex items-center gap-1 text-amber-400 font-medium">
                  <WifiOff className="w-3.5 h-3.5" />
                  Offline Mode Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Wifi className="w-3.5 h-3.5" />
                  Live Sync
                </span>
              )}
            </div>

            <button
              onClick={onOpenPersonalizeModal}
              className="hover:text-stone-100 transition-colors flex items-center gap-1 text-[11px] uppercase tracking-wider"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Personalize Feed</span>
            </button>

            {onOpenAdminDashboard && (
              <>
                <span aria-hidden="true" className="text-stone-700">·</span>
                <button
                  onClick={onOpenAdminDashboard}
                  className="hover:text-emerald-400 text-stone-400 transition-colors flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold"
                  title="Bureau Admin & Analysis Portal"
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Admin</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. GRAND MASTHEAD ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-7">
        <div className="grid grid-cols-3 items-center">
          {/* Left: Mobile toggle + Quick Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100"
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-colors bg-stone-50 dark:bg-stone-950 rounded-sm"
              aria-label="Search articles"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search NewsPulse</span>
              <kbd className="hidden sm:inline text-[10px] font-mono bg-stone-200 dark:bg-stone-800 px-1 rounded text-stone-500">
                /
              </kbd>
            </button>
          </div>

          {/* Center: Grand Broadsheet Logo */}
          <div className="flex flex-col items-center justify-center text-center">
            <button
              onClick={() => {
                onSelectCategory('all');
                onSelectFeedMode('all');
              }}
              className="group focus:outline-none"
            >
              <h1 className="font-editorial-headline text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-stone-900 dark:text-stone-50 group-hover:opacity-90 transition-opacity">
                NewsPulse
              </h1>
            </button>
            <p className="hidden sm:block text-[10px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 font-sans mt-1">
              Breaking News · World Pulse · Politics · Culture · Since 2018
            </p>
          </div>

          {/* Right: Actions (Push alerts, Offline library, Dark toggle) */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            {/* Real-Time Push Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-colors bg-stone-50 dark:bg-stone-950 rounded-sm"
              aria-label="Push Notifications"
              title="Push Notification Center"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Offline Saved Articles Library */}
            <button
              onClick={onOpenOfflineManager}
              className="relative p-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-colors bg-stone-50 dark:bg-stone-950 rounded-sm"
              aria-label="Offline Library"
              title="Saved for Offline Reading"
            >
              <Bookmark className="w-4 h-4" />
              {savedOfflineCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1 min-w-4 h-4 bg-stone-800 text-stone-100 rounded-full text-[10px] font-medium flex items-center justify-center">
                  {savedOfflineCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-colors bg-stone-50 dark:bg-stone-950 rounded-sm"
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. DESKTOP NAVIGATION BAR WITH MEGA MENUS */}
      <nav className="hidden lg:block border-t border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-950/50 relative">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive =
              (item.category && item.category === currentCategory && feedMode === 'all') ||
              (item.mode && item.mode === feedMode);

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasMega && setActiveMegaMenu(item.label)}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button
                  onClick={() => {
                    if (item.category) {
                      onSelectCategory(item.category);
                      onSelectFeedMode('all');
                    } else if (item.mode) {
                      onSelectFeedMode(item.mode);
                    }
                  }}
                  className={`px-4 py-3 text-xs tracking-wider uppercase font-semibold transition-colors flex items-center gap-1 border-b-2 ${
                    isActive
                      ? 'border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100 font-bold'
                      : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasMega && <ChevronDown className="w-3 h-3 opacity-60" />}
                </button>

                {/* MEGA MENU POPOVER */}
                {item.hasMega && activeMegaMenu === item.label && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-[650px] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl p-6 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="grid grid-cols-3 gap-6">
                      {/* Column 1: Featured In Category */}
                      <div className="border-r border-stone-200 dark:border-stone-800 pr-4">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 font-sans block mb-2">
                          Featured Dispatch
                        </span>
                        <h4 className="font-editorial-headline text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug mb-2">
                          {item.label === 'POLITICS'
                            ? 'When you tell them the truth: The Dissident Testimonies'
                            : item.label === 'BUSINESS'
                            ? "There's gloom and doom when things go boom in Dexter's lab"
                            : 'Quantum Advantage Verified Across Cryogenic Nodes'}
                        </h4>
                        <p className="text-xs text-stone-500 font-editorial-body line-clamp-3">
                          Essential long-form analysis from our senior bureau correspondents.
                        </p>
                      </div>

                      {/* Column 2: Key Subtopics */}
                      <div className="border-r border-stone-200 dark:border-stone-800 pr-4">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 font-sans block mb-2">
                          Sub-Desks
                        </span>
                        <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300 font-sans">
                          {item.label === 'POLITICS' && (
                            <>
                              <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">· Constitutional Law</li>
                              <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">· Global Treaties</li>
                              <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">· Electoral Audits</li>
                              <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">· Whistleblower Vaults</li>
                            </>
                          )}
                          {item.label === 'BUSINESS' && (
                            <>
                              <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">· Semiconductor Supply</li>
                              <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">· Central Bank Rates</li>
                              <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">· DeepTech Venture</li>
                              <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">· Global Commodities</li>
                            </>
                          )}
                          {item.label === 'TECH & AI' && (
                            <>
                              <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">· Quantum Hardware</li>
                              <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">· Cryptographic Proofs</li>
                              <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">· Open Weights Models</li>
                              <li className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">· Bio-Computation</li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* Column 3: Quick Pulse */}
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400 font-sans block mb-2">
                          Desk Status
                        </span>
                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans mb-3">
                          Live coverage active with real-time push dispatches enabled.
                        </p>
                        <button
                          onClick={() => {
                            if (item.category) onSelectCategory(item.category);
                            setActiveMegaMenu(null);
                          }}
                          className="text-xs text-blue-900 dark:text-blue-400 font-bold uppercase tracking-wider hover:underline"
                        >
                          View All {item.label} Stories →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
          <div className="w-4/5 max-w-sm h-full bg-white dark:bg-stone-900 p-6 flex flex-col overflow-y-auto border-r border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">
              <span className="font-editorial-headline text-2xl font-black">NewsPulse</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile feed mode shortcuts */}
            <div className="space-y-1 mb-6">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-sans font-bold block px-2 mb-2">
                Curated Feeds
              </span>
              <button
                onClick={() => {
                  onSelectFeedMode('all');
                  onSelectCategory('all');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-sm transition-colors ${
                  feedMode === 'all' && currentCategory === 'all'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                All Stories
              </button>
              <button
                onClick={() => {
                  onSelectFeedMode('for-you');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-sm transition-colors flex items-center justify-between ${
                  feedMode === 'for-you'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span>For You (Personalized)</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  onSelectFeedMode('trending');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-sm transition-colors ${
                  feedMode === 'trending'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                Trending Pulse
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="space-y-1 mb-6">
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-sans font-bold block px-2 mb-2">
                Categories
              </span>
              {(['politics', 'business', 'tech', 'world', 'travel', 'culture', 'opinion'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    onSelectFeedMode('all');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm uppercase tracking-wider font-medium rounded-sm transition-colors ${
                    currentCategory === cat && feedMode === 'all'
                      ? 'bg-stone-200 dark:bg-stone-800 font-bold text-stone-900 dark:text-white'
                      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Mobile Footer Actions */}
            <div className="mt-auto pt-6 border-t border-stone-200 dark:border-stone-800 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPersonalizeModal();
                }}
                className="w-full py-2 px-3 text-xs uppercase tracking-wider font-semibold border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-center flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize Feed Topics</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOfflineManager();
                }}
                className="w-full py-2 px-3 text-xs uppercase tracking-wider font-semibold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-center flex items-center justify-center gap-2"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Offline Library ({savedOfflineCount})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
