import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X,
  ArrowLeft,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  ThumbsUp,
  MessageSquare,
  Send,
  CornerDownRight,
  Check,
  Type,
  Clock,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Article, Comment, UserPreferences } from '../types';
import { formatEditorialDate } from '../utils/newsUtils';
import { EditorialImage } from './EditorialImage';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (articleId: string, authorName: string, content: string, parentId?: string) => void;
  onToggleCommentUpvote: (commentId: string) => void;
  isSavedOffline: boolean;
  onToggleSaveOffline: (article: Article) => void;
  onOpenShareModal: (article: Article) => void;
  preferences: UserPreferences;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  comments,
  onAddComment,
  onToggleCommentUpvote,
  isSavedOffline,
  onToggleSaveOffline,
  onOpenShareModal,
  preferences,
}) => {
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyText, setReplyText] = useState('');
  const [commentSort, setCommentSort] = useState<'newest' | 'upvoted'>('upvoted');

  // Reader customization state
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>(preferences.fontSize);
  const [readerSerif, setReaderSerif] = useState(preferences.fontSerif);

  // Audio speech narration
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll progress
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const scrollableDistance = scrollHeight - clientHeight;
      if (scrollableDistance > 0) {
        const progress = (scrollTop / scrollableDistance) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setScrollProgress(0);
      }
    }
  };

  // Reset scroll and progress on article change
  useEffect(() => {
    setScrollProgress(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [article?.id]);

  // Text-to-speech synthetic audio
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeechAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !article) {
      setIsPlayingAudio(!isPlayingAudio);
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${article.excerpt}. ${article.content.map((b) => b.text).join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  if (!article) return null;

  const articleComments = comments.filter((c) => c.articleId === article.id);
  const sortedComments = [...articleComments].sort((a, b) => {
    if (commentSort === 'upvoted') return b.upvotes - a.upvotes;
    return 0; // maintain newest insertion order
  });

  const handlePostRootComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(article.id, commentAuthor || 'Guest Reader', commentText.trim());
    setCommentText('');
  };

  const handlePostReply = (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddComment(article.id, replyAuthor || 'Guest Reader', replyText.trim(), parentId);
    setReplyText('');
    setReplyingToId(null);
  };

  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose',
  }[readerFontSize];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-center overflow-hidden"
    >
      <motion.div
        ref={scrollRef}
        onScroll={handleScroll}
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl h-full bg-white dark:bg-stone-900 overflow-y-auto flex flex-col shadow-2xl border-x border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 relative"
      >
        {/* Thin Reading Progress Bar pinned at the very top of ArticleDetailModal */}
        <div
          className="sticky top-0 left-0 right-0 z-50 w-full h-[3px] bg-stone-200/70 dark:bg-stone-800 overflow-hidden shrink-0"
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Article reading progress"
        >
          <div
            className="h-full bg-blue-700 dark:bg-blue-400 transition-[width] duration-100 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Sticky Reading Header Bar */}
        <div className="sticky top-[3px] z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 sm:px-8 py-3 flex items-center justify-between gap-4">

          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Newsroom</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Listen Button */}
            <button
              onClick={toggleSpeechAudio}
              className={`px-3 py-1.5 text-xs font-sans font-semibold rounded-sm transition-colors flex items-center gap-1.5 ${
                isPlayingAudio
                  ? 'bg-blue-900 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
              title="Listen to this article"
              aria-label={isPlayingAudio ? 'Stop audio narration' : 'Listen to article'}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlayingAudio ? 'Stop Audio' : 'Listen (7m)'}</span>
            </button>

            {/* Typography adjusters */}
            <div className="hidden sm:flex items-center gap-1 border border-stone-200 dark:border-stone-800 rounded-sm p-0.5">
              <button
                onClick={() => setReaderFontSize((prev) => (prev === 'xl' ? 'lg' : prev === 'lg' ? 'base' : 'sm'))}
                className="px-2 py-1 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                title="Decrease font size"
                aria-label="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={() => setReaderFontSize((prev) => (prev === 'sm' ? 'base' : prev === 'base' ? 'lg' : 'xl'))}
                className="px-2 py-1 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                title="Increase font size"
                aria-label="Increase font size"
              >
                A+
              </button>
              <button
                onClick={() => setReaderSerif(!readerSerif)}
                className={`px-2 py-1 text-xs font-semibold rounded-xs transition-colors ${
                  readerSerif ? 'bg-stone-200 dark:bg-stone-700' : ''
                }`}
                title="Toggle Serif/Sans typeface"
                aria-label="Toggle Serif or Sans typeface"
              >
                <Type className="w-3 h-3" />
              </button>
            </div>

            {/* Offline save toggle */}
            <button
              onClick={() => onToggleSaveOffline(article)}
              className={`p-1.5 border border-stone-200 dark:border-stone-800 rounded-sm transition-colors ${
                isSavedOffline
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
              title={isSavedOffline ? 'Saved for offline reading' : 'Save for offline'}
              aria-label={isSavedOffline ? 'Remove from offline' : 'Save for offline'}
            >
              {isSavedOffline ? <Check className="w-4 h-4 text-emerald-400" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Share button */}
            <button
              onClick={() => onOpenShareModal(article)}
              className="p-1.5 border border-stone-200 dark:border-stone-800 rounded-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 transition-colors"
              title="Share article"
              aria-label="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 ml-1"
              aria-label="Close article reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Body Content */}
        <article className="px-6 sm:px-12 md:px-16 py-8 sm:py-12 max-w-3xl mx-auto w-full">
          {/* Metadata Header (Zero-Pill discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-sans mb-4">
            <span className="font-bold text-stone-800 dark:text-stone-200">{article.category}</span>
            <span aria-hidden="true">·</span>
            <span>{formatEditorialDate(article.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min read
            </span>
            {article.source && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-emerald-800 dark:text-emerald-400 font-mono">
                  Source: {article.source}
                </span>
              </>
            )}
            {article.isBreaking && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-red-600 font-bold">Breaking Dispatch</span>
              </>
            )}
          </div>

          {/* Headline */}
          <h1
            className="font-editorial-headline text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-stone-900 dark:text-stone-50 mb-4"
            style={{ textWrap: 'balance' }}
          >
            {article.title}
          </h1>

          {/* Subtitle */}
          {article.subtitle && (
            <p className="font-editorial-body text-lg sm:text-xl text-stone-600 dark:text-stone-300 leading-relaxed mb-6 italic">
              {article.subtitle}
            </p>
          )}

          {/* Author Byline & Location */}
          <div className="flex items-center justify-between py-4 border-y border-stone-200 dark:border-stone-800 mb-8 font-sans">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300">
                {article.author.name.charAt(0)}
              </div>
              <div>
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100 block">
                  By {article.author.name}
                </span>
                <span className="text-xs text-stone-500">{article.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-stone-500">
              <button
                onClick={() => onOpenShareModal(article)}
                className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Featured Image Plate */}
          <figure className="mb-8">
            <div className="relative overflow-hidden bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 h-[360px] sm:h-[440px]">
              <EditorialImage
                articleId={article.id}
                title={article.title}
                category={article.category}
                className="w-full h-full object-cover"
              />
            </div>
            {article.imageCaption && (
              <figcaption className="text-xs font-editorial-body italic text-stone-500 mt-2 px-1 text-center">
                {article.imageCaption}
              </figcaption>
            )}
          </figure>

          {/* Excerpt / Lead Intro */}
          <div className="text-base sm:text-lg font-medium leading-relaxed text-stone-800 dark:text-stone-200 mb-6 font-sans">
            {article.locationStamp && (
              <span className="font-bold tracking-widest text-stone-900 dark:text-stone-100 mr-2">
                {article.locationStamp}
              </span>
            )}
            {article.excerpt}
          </div>

          {/* Content Blocks */}
          <div className={`space-y-6 ${readerSerif ? 'font-editorial-body' : 'font-sans'} ${fontSizeClass} text-stone-800 dark:text-stone-200`}>
            {article.content.map((block, idx) => {
              if (block.type === 'heading') {
                return (
                  <h3
                    key={idx}
                    className="font-editorial-headline text-2xl font-bold text-stone-900 dark:text-stone-100 mt-8 mb-3"
                  >
                    {block.text}
                  </h3>
                );
              }
              if (block.type === 'quote') {
                return (
                  <div
                    key={idx}
                    className="py-6 my-8 border-y border-stone-200 dark:border-stone-800 text-center px-4"
                  >
                    <blockquote className="font-editorial-headline text-xl sm:text-2xl italic font-medium text-stone-900 dark:text-stone-100 leading-snug">
                      "{block.text}"
                    </blockquote>
                    {block.subtext && (
                      <cite className="block text-xs uppercase tracking-widest text-stone-500 font-sans mt-3 not-italic">
                        {block.subtext}
                      </cite>
                    )}
                  </div>
                );
              }
              return (
                <p key={idx} className={idx === 0 ? 'drop-cap' : ''}>
                  {block.text}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-sans font-bold mr-2">
              Filed Under:
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-sans"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Social Share Callout Strip */}
          <div className="mt-8 p-4 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm flex items-center justify-between">
            <div>
              <span className="font-sans text-xs font-bold text-stone-900 dark:text-stone-100 block">
                Liked this dispatch?
              </span>
              <span className="text-xs text-stone-500 font-sans">
                Share with colleagues or save it for your offline flight library.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenShareModal(article)}
                className="px-3 py-1.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-sans font-semibold rounded-sm hover:bg-stone-800"
              >
                Share Story
              </button>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────── */}
          {/* COMMUNITY ENGAGEMENT & COMMENT SECTION */}
          {/* ────────────────────────────────────────────────────────── */}
          <section className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-stone-700 dark:text-stone-300" />
                <h3 className="font-editorial-headline text-xl font-bold text-stone-900 dark:text-stone-100">
                  Reader Discussion ({articleComments.length})
                </h3>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1 text-xs font-sans text-stone-500">
                <span>Sort by:</span>
                <button
                  onClick={() => setCommentSort('upvoted')}
                  className={`font-semibold ml-1 ${
                    commentSort === 'upvoted'
                      ? 'text-stone-900 dark:text-stone-100 underline'
                      : 'hover:text-stone-900'
                  }`}
                >
                  Top Rated
                </button>
                <span>·</span>
                <button
                  onClick={() => setCommentSort('newest')}
                  className={`font-semibold ${
                    commentSort === 'newest'
                      ? 'text-stone-900 dark:text-stone-100 underline'
                      : 'hover:text-stone-900'
                  }`}
                >
                  Recent
                </button>
              </div>
            </div>

            {/* Post Root Comment Form */}
            <form onSubmit={handlePostRootComment} className="mb-8 p-4 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm">
              <span className="text-xs uppercase tracking-wider font-bold text-stone-500 font-sans block mb-2">
                Join the conversation
              </span>

              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Your Name or Pseudonym (optional)"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-sm text-stone-900 dark:text-stone-100 font-sans focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="mb-3">
                <textarea
                  rows={3}
                  required
                  placeholder="Contribute thoughtful analysis or context..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-sm text-stone-900 dark:text-stone-100 font-sans focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-sans">
                  Civil community guidelines apply
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-sans font-semibold rounded-sm hover:bg-stone-800 flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>

            {/* Comments Thread */}
            <div className="space-y-4">
              {sortedComments.length === 0 ? (
                <div className="py-8 text-center text-stone-500 text-xs font-sans">
                  No comments yet. Be the first to share your perspective on this dispatch.
                </div>
              ) : (
                sortedComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 border border-stone-200 dark:border-stone-800 rounded-sm bg-white dark:bg-stone-900"
                  >
                    <div className="flex items-center justify-between mb-2 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                          {comment.authorName}
                        </span>
                        <span className="text-[11px] text-stone-400">· {comment.timestamp}</span>
                      </div>

                      {/* Upvote button */}
                      <button
                        onClick={() => onToggleCommentUpvote(comment.id)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                          comment.userUpvoted
                            ? 'text-blue-900 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/40'
                            : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                        }`}
                        title="Upvote comment"
                        aria-label={`Upvote comment by ${comment.authorName}`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span className="tabular-nums">{comment.upvotes}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 font-editorial-body leading-relaxed mb-3">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-sans text-stone-500">
                      <button
                        onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                        className="hover:text-stone-900 dark:hover:text-stone-100 font-semibold flex items-center gap-1"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        <span>Reply</span>
                      </button>
                    </div>

                    {/* Inline Reply Form */}
                    {replyingToId === comment.id && (
                      <form
                        onSubmit={(e) => handlePostReply(comment.id, e)}
                        className="mt-3 p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-sm"
                      >
                        <div className="mb-2">
                          <input
                            type="text"
                            placeholder="Your Name (optional)"
                            value={replyAuthor}
                            onChange={(e) => setReplyAuthor(e.target.value)}
                            className="w-full text-xs px-2.5 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-sm text-stone-900 dark:text-stone-100 font-sans focus:outline-none"
                          />
                        </div>
                        <div className="mb-2">
                          <textarea
                            rows={2}
                            required
                            placeholder={`Reply to ${comment.authorName}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full text-xs p-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-sm text-stone-900 dark:text-stone-100 font-sans focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingToId(null)}
                            className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-900"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3 py-1 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-sans font-semibold rounded-sm"
                          >
                            Submit Reply
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 pt-3 pl-4 border-l-2 border-stone-200 dark:border-stone-800 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="text-xs">
                            <div className="flex items-center justify-between mb-1 font-sans">
                              <span className="font-bold text-stone-900 dark:text-stone-100">
                                {reply.authorName}
                              </span>
                              <span className="text-[11px] text-stone-400">{reply.timestamp}</span>
                            </div>
                            <p className="text-stone-600 dark:text-stone-300 font-editorial-body leading-relaxed">
                              {reply.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </article>
      </motion.div>
    </motion.div>
  );
};
