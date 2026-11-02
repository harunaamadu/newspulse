import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, Bell, BookOpen, Globe } from 'lucide-react';
import { Category, UserPreferences } from '../types';

interface PersonalizeFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (updated: UserPreferences) => void;
}

export const PersonalizeFeedModal: React.FC<PersonalizeFeedModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [selectedTopics, setSelectedTopics] = useState<Category[]>(preferences.selectedTopics);
  const [pushEnabled, setPushEnabled] = useState(preferences.pushEnabled);
  const [breakingNewsAlerts, setBreakingNewsAlerts] = useState(preferences.breakingNewsAlerts);
  const [fontSize, setFontSize] = useState(preferences.fontSize);
  const [fontSerif, setFontSerif] = useState(preferences.fontSerif);
  const [edition, setEdition] = useState(preferences.edition);

  if (!isOpen) return null;

  const topicOptions: { id: Category; label: string; desc: string }[] = [
    { id: 'politics', label: 'Politics & Governance', desc: 'Parliamentary transcripts, diplomacy & civil liberties' },
    { id: 'business', label: 'Business & Venture', desc: 'Central banks, commodities, markets & startup deeptech' },
    { id: 'tech', label: 'Tech & Quantum AI', desc: 'Computing milestones, algorithms & cybersecurity' },
    { id: 'world', label: 'World Affairs', desc: 'Geopolitics, climate accords & international treaties' },
    { id: 'culture', label: 'Culture & Architecture', desc: 'Museum monographs, design & literary essays' },
    { id: 'travel', label: 'Travel & Expeditions', desc: 'Documentary dispatches from remote landscapes' },
    { id: 'opinion', label: 'Opinion & Broadsheet Columns', desc: 'Curated editorial perspectives by distinguished essayists' },
  ];

  const toggleTopic = (cat: Category) => {
    if (selectedTopics.includes(cat)) {
      if (selectedTopics.length > 1) {
        setSelectedTopics(selectedTopics.filter((t) => t !== cat));
      }
    } else {
      setSelectedTopics([...selectedTopics, cat]);
    }
  };

  const handleSave = () => {
    onSavePreferences({
      selectedTopics,
      pushEnabled,
      breakingNewsAlerts,
      dailyDigest: preferences.dailyDigest,
      fontSize,
      fontSerif,
      edition,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 w-full max-w-xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-6">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <h3 className="font-editorial-headline text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
              Personalize Your Feed
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            aria-label="Close personalization modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* 1. Topics Selection */}
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold text-stone-500 font-sans mb-3">
              1. Select Your Preferred Desks & Categories
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {topicOptions.map((topic) => {
                const isChecked = selectedTopics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className={`p-3 text-left border rounded-sm transition-all flex items-start justify-between gap-2 ${
                      isChecked
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-50 dark:bg-stone-800/60 shadow-xs'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600'
                    }`}
                  >
                    <div>
                      <div className="font-sans text-xs font-bold text-stone-900 dark:text-stone-100 mb-0.5">
                        {topic.label}
                      </div>
                      <div className="font-sans text-[11px] text-stone-500 leading-tight">
                        {topic.desc}
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-sm border shrink-0 flex items-center justify-center ${
                        isChecked
                          ? 'bg-stone-900 border-stone-900 dark:bg-stone-100 dark:border-stone-100 text-white dark:text-stone-900'
                          : 'border-stone-300 dark:border-stone-700'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Push Notification Preferences */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <label className="text-xs uppercase tracking-widest font-bold text-stone-500 font-sans">
                2. Real-Time Push Notification Alerts
              </label>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 border border-stone-200 dark:border-stone-800 rounded-sm cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                <div>
                  <span className="font-sans text-xs font-bold text-stone-900 dark:text-stone-100 block">
                    Enable Real-Time Push Notifications
                  </span>
                  <span className="text-[11px] text-stone-500 font-sans">
                    Receive urgent breaking alerts as bulletins cross the wires
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={(e) => setPushEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-stone-900 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 border border-stone-200 dark:border-stone-800 rounded-sm cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                <div>
                  <span className="font-sans text-xs font-bold text-stone-900 dark:text-stone-100 block">
                    Flash Breaking News Only
                  </span>
                  <span className="text-[11px] text-stone-500 font-sans">
                    Filter out routine updates and prioritize global emergencies
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={breakingNewsAlerts}
                  onChange={(e) => setBreakingNewsAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-stone-900 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* 3. Reading Typography & Edition */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <label className="text-xs uppercase tracking-widest font-bold text-stone-500 font-sans">
                3. Typography & Edition
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1">
                  Typeface Style:
                </span>
                <div className="flex rounded-sm border border-stone-200 dark:border-stone-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => setFontSerif(true)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                      fontSerif
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    Broadsheet Serif
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSerif(false)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                      !fontSerif
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    Modern Sans
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-stone-700 dark:text-stone-300 block mb-1">
                  Reading Text Size:
                </span>
                <div className="flex rounded-sm border border-stone-200 dark:border-stone-800 p-0.5">
                  {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setFontSize(sz)}
                      className={`flex-1 py-1.5 text-xs uppercase font-medium rounded-sm transition-colors ${
                        fontSize === sz
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-sans font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-sans font-semibold uppercase tracking-wider hover:bg-stone-800 dark:hover:bg-white transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
