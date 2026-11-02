import React, { useState, useMemo } from 'react';
import { Search, X, Calendar, Filter, ArrowRight, Clock } from 'lucide-react';
import { Article, Category, DateFilterType } from '../types';
import { filterArticlesBySearch, formatEditorialDate } from '../utils/newsUtils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const filteredResults = useMemo(() => {
    return filterArticlesBySearch(articles, {
      query,
      category: selectedCategory,
      dateFilter,
      customStartDate: customStartDate || undefined,
      customEndDate: customEndDate || undefined,
    });
  }, [articles, query, selectedCategory, dateFilter, customStartDate, customEndDate]);

  if (!isOpen) return null;

  const categories: { label: string; value: Category }[] = [
    { label: 'All Topics', value: 'all' },
    { label: 'Politics', value: 'politics' },
    { label: 'Business', value: 'business' },
    { label: 'Tech & AI', value: 'tech' },
    { label: 'World', value: 'world' },
    { label: 'Travel', value: 'travel' },
    { label: 'Culture', value: 'culture' },
    { label: 'Opinion', value: 'opinion' },
  ];

  const dateOptions: { label: string; value: DateFilterType }[] = [
    { label: 'Any Date', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Past 7 Days', value: 'week' },
    { label: 'Past 30 Days', value: 'month' },
    { label: 'Custom Range', value: 'custom' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 md:p-12 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 w-full max-w-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden mt-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search headlines, authors, tags, transcripts, topics..."
            className="w-full bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 text-base sm:text-lg focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-sm ml-2"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Bar (Interactive filter buttons) */}
        <div className="p-4 bg-stone-50 dark:bg-stone-950/70 border-b border-stone-200 dark:border-stone-800 space-y-3">
          {/* Topic filter bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-sans">
            <span className="text-stone-400 uppercase tracking-widest text-[10px] font-bold shrink-0">
              Topic:
            </span>
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`px-3 py-1 rounded-sm whitespace-nowrap transition-colors ${
                  selectedCategory === c.value
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                    : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Date range filter bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
            <span className="text-stone-400 uppercase tracking-widest text-[10px] font-bold shrink-0">
              Date:
            </span>
            {dateOptions.map((d) => (
              <button
                key={d.value}
                onClick={() => setDateFilter(d.value)}
                className={`px-2.5 py-1 rounded-sm whitespace-nowrap transition-colors ${
                  dateFilter === d.value
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                    : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Custom Date Pickers (if Custom Range selected) */}
          {dateFilter === 'custom' && (
            <div className="flex items-center gap-3 pt-2 text-xs font-sans text-stone-600 dark:text-stone-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>From:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-2 py-1 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-sm text-stone-900 dark:text-stone-100"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span>To:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-2 py-1 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-sm text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Count Header */}
        <div className="px-6 py-2.5 bg-stone-100/60 dark:bg-stone-900 text-xs text-stone-500 font-sans flex items-center justify-between border-b border-stone-200 dark:border-stone-800">
          <span>
            {filteredResults.length} {filteredResults.length === 1 ? 'article' : 'articles'} found
          </span>
          <span className="text-[11px] text-stone-400">Press ESC to dismiss</span>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/80 p-2 sm:p-4">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-sans font-medium">No editorial stories match your criteria</p>
              <p className="text-xs text-stone-400 mt-1">Try broadening your search term or selecting 'All Topics'</p>
            </div>
          ) : (
            filteredResults.map((article) => (
              <div
                key={article.id}
                onClick={() => {
                  onSelectArticle(article);
                  onClose();
                }}
                className="p-3 sm:p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer transition-colors group flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-sans mb-1">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatEditorialDate(article.publishedAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTime} min read</span>
                  </div>

                  <h4 className="font-editorial-headline text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors leading-snug mb-1">
                    {article.title}
                  </h4>

                  <p className="font-editorial-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="shrink-0 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-stone-500 group-hover:text-stone-900 dark:group-hover:text-stone-100" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
