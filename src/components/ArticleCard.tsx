import React from 'react';
import { Article } from '../types';
import { Bookmark, Clock, MessageSquare, ArrowRight, Check } from 'lucide-react';
import { formatEditorialDate } from '../utils/newsUtils';
import { EditorialImage } from './EditorialImage';

interface ArticleCardProps {
  article: Article;
  variant?: 'hero-lead' | 'hero-stacked' | 'hero-half' | 'grid-5' | 'politics-lead' | 'politics-side' | 'compact';
  onSelectArticle: (article: Article) => void;
  isSavedOffline: boolean;
  onToggleSaveOffline: (article: Article, e: React.MouseEvent) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'grid-5',
  onSelectArticle,
  isSavedOffline,
  onToggleSaveOffline,
}) => {
  const formattedDate = formatEditorialDate(article.publishedAt);

  // Variant: Center Grand Hero Lead (matches user's uploaded image middle section)
  if (variant === 'hero-lead') {
    return (
      <article className="flex flex-col h-full group">
        <div className="relative overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="w-full h-[380px] sm:h-[440px] lg:h-[480px] overflow-hidden">
            <EditorialImage
              articleId={article.id}
              title={article.title}
              category={article.category}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>

          {/* Quick Offline Save action */}
          <button
            onClick={(e) => onToggleSaveOffline(article, e)}
            aria-label={isSavedOffline ? `Saved offline: ${article.title}` : `Save offline: ${article.title}`}
            title={isSavedOffline ? 'Saved for offline reading' : 'Save for offline reading'}
            className="absolute top-4 right-4 p-2.5 bg-stone-900/80 hover:bg-stone-900 text-stone-100 backdrop-blur-sm transition-colors rounded-sm"
          >
            {isSavedOffline ? <Check className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Content beneath image */}
        <div className="pt-6 pb-4 flex flex-col flex-1 text-center">
          {/* Clean unboxed metadata (strictly zero-pill) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-sans mb-3">
            <span>{formattedDate}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-stone-700 dark:text-stone-300">{article.category}</span>
            {article.source && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">Src: {article.source}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{article.readTime} min read</span>
          </div>

          <h1
            onClick={() => onSelectArticle(article)}
            className="font-editorial-headline text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-stone-900 dark:text-stone-50 cursor-pointer hover:text-stone-600 dark:hover:text-stone-300 transition-colors mb-3 px-2"
            style={{ textWrap: 'balance' }}
          >
            {article.title}
          </h1>

          <p className="font-editorial-body text-stone-600 dark:text-stone-400 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6 px-4">
            {article.excerpt}
          </p>

          <div className="mt-auto flex items-center justify-center">
            <button
              onClick={() => onSelectArticle(article)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-sans text-xs tracking-wider uppercase font-semibold transition-colors rounded-xs shadow-xs"
            >
              <span>Read More</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Variant: Hero Left Stacked (2 vertical cards)
  if (variant === 'hero-stacked') {
    return (
      <article className="flex flex-col pb-6 border-b border-stone-200 dark:border-stone-800 last:border-b-0 group">
        <div className="relative overflow-hidden bg-stone-100 dark:bg-stone-900 mb-3 border border-stone-200 dark:border-stone-800 h-44 sm:h-48">
          <EditorialImage
            articleId={article.id}
            title={article.title}
            category={article.category}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <button
            onClick={(e) => onToggleSaveOffline(article, e)}
            aria-label={isSavedOffline ? `Saved offline: ${article.title}` : `Save offline: ${article.title}`}
            className="absolute top-2 right-2 p-1.5 bg-stone-900/80 text-stone-100 hover:bg-stone-900 transition-colors"
          >
            {isSavedOffline ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        <h3
          onClick={() => onSelectArticle(article)}
          className="font-editorial-headline text-lg font-bold text-stone-900 dark:text-stone-100 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer transition-colors leading-snug mb-2"
        >
          {article.title}
        </h3>

        <p className="font-editorial-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3 mb-2">
          {article.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-sans mt-auto">
          <span>{formattedDate}</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{article.category}</span>
          {article.source && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">{article.source}</span>
            </>
          )}
        </div>
      </article>
    );
  }

  // Variant: Hero Right Half Post
  if (variant === 'hero-half') {
    return (
      <article className="flex flex-col h-full group">
        <div className="relative overflow-hidden bg-stone-100 dark:bg-stone-900 mb-4 border border-stone-200 dark:border-stone-800 h-56 sm:h-64">
          <EditorialImage
            articleId={article.id}
            title={article.title}
            category={article.category}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <button
            onClick={(e) => onToggleSaveOffline(article, e)}
            aria-label={isSavedOffline ? `Saved offline: ${article.title}` : `Save offline: ${article.title}`}
            className="absolute top-2 right-2 p-2 bg-stone-900/80 text-stone-100 hover:bg-stone-900 transition-colors"
          >
            {isSavedOffline ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>

        <h2
          onClick={() => onSelectArticle(article)}
          className="font-editorial-headline text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer transition-colors leading-snug mb-3"
        >
          {article.title}
        </h2>

        <p className="font-editorial-body text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-4 mb-4">
          {article.excerpt}
        </p>

        <div className="mt-auto flex items-center justify-between text-xs text-stone-500 font-sans pt-2 border-t border-stone-100 dark:border-stone-900">
          <div className="flex items-center gap-2">
            <span>{formattedDate}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime} min</span>
          </div>
          <div className="flex items-center gap-1.5 text-stone-500">
            <MessageSquare className="w-3 h-3" />
            <span className="tabular-nums">{article.commentsCount}</span>
          </div>
        </div>
      </article>
    );
  }

  // Variant: Politics Section Lead
  if (variant === 'politics-lead') {
    return (
      <article className="flex flex-col h-full group">
        <div className="relative overflow-hidden bg-stone-100 dark:bg-stone-900 mb-4 border border-stone-200 dark:border-stone-800 h-[300px] sm:h-[380px]">
          <EditorialImage
            articleId={article.id}
            title={article.title}
            category={article.category}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <button
            onClick={(e) => onToggleSaveOffline(article, e)}
            aria-label={isSavedOffline ? `Saved offline: ${article.title}` : `Save offline: ${article.title}`}
            className="absolute top-3 right-3 p-2 bg-stone-900/80 text-stone-100 hover:bg-stone-900 transition-colors"
          >
            {isSavedOffline ? <Check className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        <h2
          onClick={() => onSelectArticle(article)}
          className="font-editorial-headline text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer transition-colors leading-tight mb-2"
        >
          {article.title}
        </h2>

        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-sans mb-3">
          <span>{formattedDate}</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize font-semibold text-stone-700 dark:text-stone-300">{article.category}</span>
          {article.source && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">Src: {article.source}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span>By {article.author.name}</span>
        </div>

        <p className="font-editorial-body text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3 mb-5">
          {article.excerpt}
        </p>

        <div>
          <button
            onClick={() => onSelectArticle(article)}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-900 hover:bg-blue-800 text-white font-sans text-xs tracking-wider uppercase font-semibold transition-colors"
          >
            <span>Read More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </article>
    );
  }

  // Variant: Politics Section Side List item
  if (variant === 'politics-side') {
    return (
      <article className="flex items-start justify-between gap-4 py-4 border-b border-stone-200 dark:border-stone-800 last:border-b-0 group">
        <div className="flex-1 min-w-0">
          <h3
            onClick={() => onSelectArticle(article)}
            className="font-editorial-headline text-base font-bold text-stone-900 dark:text-stone-100 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer transition-colors leading-snug mb-1"
          >
            {article.title}
          </h3>

          <p className="font-editorial-body text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mb-2 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-2 text-xs text-stone-500 font-sans">
            <span>{formattedDate}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readTime}m</span>
          </div>
        </div>

        <div className="w-20 h-20 shrink-0 relative bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden">
          <EditorialImage
            articleId={article.id}
            title={article.title}
            category={article.category}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </article>
    );
  }

  // Default Variant: 5-Column Grid Card (Business & Travel sections)
  return (
    <article className="flex flex-col h-full group">
      <div className="relative overflow-hidden bg-stone-100 dark:bg-stone-900 aspect-[4/3] mb-3 border border-stone-200 dark:border-stone-800">
        <EditorialImage
          articleId={article.id}
          title={article.title}
          category={article.category}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <button
          onClick={(e) => onToggleSaveOffline(article, e)}
          aria-label={isSavedOffline ? `Saved offline: ${article.title}` : `Save offline: ${article.title}`}
          className="absolute top-2 right-2 p-1.5 bg-stone-900/80 text-stone-100 hover:bg-stone-900 transition-colors"
        >
          {isSavedOffline ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>
      </div>

      <h3
        onClick={() => onSelectArticle(article)}
        className="font-editorial-headline text-base font-bold text-stone-900 dark:text-stone-100 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer transition-colors leading-snug mb-2 line-clamp-2"
      >
        {article.title}
      </h3>

      <p className="font-editorial-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-3 mb-3 leading-relaxed">
        {article.excerpt}
      </p>

      <div className="mt-auto pt-2 border-t border-stone-100 dark:border-stone-900 flex items-center justify-between text-xs text-stone-500 font-sans">
        <span>{formattedDate}</span>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{article.readTime}m</span>
        </div>
      </div>
    </article>
  );
};
