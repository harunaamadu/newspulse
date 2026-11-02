import React from 'react';
import { Category } from '../types';
import { Bookmark, Bell, Search, WifiOff, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: Category) => void;
  onOpenSearch: () => void;
  onOpenOfflineManager: () => void;
  onOpenPersonalizeModal: () => void;
  onToggleDarkMode: () => void;
  darkMode: boolean;
  onOpenAdminDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenSearch,
  onOpenOfflineManager,
  onOpenPersonalizeModal,
  onToggleDarkMode,
  darkMode,
  onOpenAdminDashboard,
}) => {
  return (
    <footer className="w-full bg-stone-900 text-stone-300 dark:bg-black dark:text-stone-400 border-t border-stone-800 transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 md:py-16">
        {/* Top Grand Brand Lockup */}
        <div className="border-b border-stone-800 pb-10 mb-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="font-editorial-headline text-3xl sm:text-4xl font-black text-stone-100 tracking-tight">
              NewsPulse
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-400 font-sans mt-1">
              Independent Global Broadsheet · Verifiable Witness · Since 2018
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-sans">
            <button
              onClick={onOpenSearch}
              className="px-3 py-1.5 border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white rounded-xs transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Archives</span>
            </button>
            <button
              onClick={onOpenOfflineManager}
              className="px-3 py-1.5 border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-white rounded-xs transition-colors flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Offline Reader</span>
            </button>
            <button
              onClick={onOpenPersonalizeModal}
              className="px-3 py-1.5 bg-stone-100 text-stone-900 font-bold hover:bg-white rounded-xs transition-colors"
            >
              Customize Feed
            </button>
            <button
              onClick={onOpenAdminDashboard}
              className="px-3 py-1.5 border border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 rounded-xs transition-colors flex items-center gap-1.5"
              title="Secure Staff & Editorial Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Staff Dashboard</span>
            </button>
          </div>
        </div>

        {/* 4-Column Editorial Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-xs font-sans">
          {/* Desks */}
          <div>
            <span className="font-bold text-stone-200 uppercase tracking-widest text-[11px] block mb-3">
              Editorial Desks
            </span>
            <ul className="space-y-2">
              {(['politics', 'business', 'tech', 'world', 'opinion'] as Category[]).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors capitalize"
                  >
                    {cat === 'tech' ? 'Tech & Quantum' : cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <span className="font-bold text-stone-200 uppercase tracking-widest text-[11px] block mb-3">
              Features & Expeditions
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('travel');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Travel & Landscapes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('culture');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Culture & Monographs
                </button>
              </li>
              <li>
                <span className="text-stone-500">Documentary Photo Galleries</span>
              </li>
              <li>
                <span className="text-stone-500">Audio Dispatches</span>
              </li>
            </ul>
          </div>

          {/* Reader Capabilities */}
          <div>
            <span className="font-bold text-stone-200 uppercase tracking-widest text-[11px] block mb-3">
              Reader Technology
            </span>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenOfflineManager} className="hover:text-white transition-colors text-left">
                  Offline Article Caching
                </button>
              </li>
              <li>
                <button onClick={onOpenPersonalizeModal} className="hover:text-white transition-colors text-left">
                  Real-Time Push Alerts
                </button>
              </li>
              <li>
                <button onClick={onToggleDarkMode} className="hover:text-white transition-colors text-left">
                  {darkMode ? 'Switch to Light Broadsheet' : 'Switch to Dark Mode'}
                </button>
              </li>
              <li>
                <span className="text-stone-500">PWA Offline Storage</span>
              </li>
            </ul>
          </div>

          {/* Standards & Trust */}
          <div>
            <span className="font-bold text-stone-200 uppercase tracking-widest text-[11px] block mb-3">
              Standards & Integrity
            </span>
            <p className="text-stone-400 leading-relaxed text-[11px] mb-3">
              NewsPulse reports without algorithmic manipulation. Articles are curated by human editors adhering to the International Press Charter.
            </p>
            <div className="flex items-center gap-3 text-stone-400">
              <span className="hover:text-white cursor-pointer">Code of Ethics</span>
              <span aria-hidden="true">·</span>
              <span className="hover:text-white cursor-pointer">Corrections</span>
            </div>
          </div>
        </div>

        {/* Bottom Hairline & Legal */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-sans">
          <p>© 2026 NewsPulse Broadsheet Publishing Group. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Charter</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-stone-400 cursor-pointer">Offline Terms</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-stone-400 cursor-pointer">Syndication</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenAdminDashboard}
              className="text-stone-400 hover:text-white transition-colors"
            >
              Editorial Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
