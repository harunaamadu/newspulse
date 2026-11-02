import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { INITIAL_ARTICLES, INITIAL_COMMENTS, INITIAL_NOTIFICATIONS, INITIAL_FLASH_NEWS } from './data/mockArticles';
import { Article, Category, Comment, PushNotification, UserPreferences, FlashNewsItem } from './types';
import { Header } from './components/Header';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { SearchModal } from './components/SearchModal';
import { PersonalizeFeedModal } from './components/PersonalizeFeedModal';
import { NotificationCenter } from './components/NotificationCenter';
import { OfflineManagerModal } from './components/OfflineManagerModal';
import { ShareModal } from './components/ShareModal';
import { PushToast } from './components/PushToast';
import { Footer } from './components/Footer';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import {
  filterArticlesByPersonalizedFeed,
  toggleCommentUpvote,
  addCommentToThread,
} from './utils/newsUtils';
import {
  WifiOff,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Check,
  RotateCcw,
} from 'lucide-react';

const DEFAULT_PREFERENCES: UserPreferences = {
  selectedTopics: ['politics', 'business', 'tech', 'world'],
  pushEnabled: true,
  breakingNewsAlerts: true,
  dailyDigest: false,
  fontSize: 'base',
  fontSerif: true,
  edition: 'Global',
};

export default function App() {
  // 1. Articles & Persistent State
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const stored = localStorage.getItem('newspulse_articles');
      return stored ? JSON.parse(stored) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('newspulse_articles', JSON.stringify(articles));
    } catch (e) {
      // ignore
    }
  }, [articles]);
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const stored = localStorage.getItem('newspulse_comments');
      return stored ? JSON.parse(stored) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('newspulse_saved_ids');
      return stored ? JSON.parse(stored) : ['lead-story-1', 'biz-1'];
    } catch {
      return ['lead-story-1', 'biz-1'];
    }
  });

  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    try {
      const stored = localStorage.getItem('newspulse_notifications');
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [flashNews, setFlashNews] = useState<FlashNewsItem[]>(() => {
    try {
      const stored = localStorage.getItem('newspulse_flash_news');
      return stored ? JSON.parse(stored) : INITIAL_FLASH_NEWS;
    } catch {
      return INITIAL_FLASH_NEWS;
    }
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const stored = localStorage.getItem('newspulse_preferences');
      return stored ? JSON.parse(stored) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  // Dark Mode state with html.dark class management
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('newspulse_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Sync dark class on document element
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('newspulse_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('newspulse_theme', 'light');
      }
    } catch {
      // localStorage unavailable in certain environments
    }
  }, [darkMode]);

  // Persist comments, saved articles, notifications, preferences
  useEffect(() => {
    try {
      localStorage.setItem('newspulse_comments', JSON.stringify(comments));
    } catch {}
  }, [comments]);

  useEffect(() => {
    try {
      localStorage.setItem('newspulse_saved_ids', JSON.stringify(savedArticleIds));
    } catch {}
  }, [savedArticleIds]);

  useEffect(() => {
    try {
      localStorage.setItem('newspulse_notifications', JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('newspulse_preferences', JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  useEffect(() => {
    try {
      localStorage.setItem('newspulse_flash_news', JSON.stringify(flashNews));
    } catch {}
  }, [flashNews]);

  // View & Filter states
  const [currentCategory, setCurrentCategory] = useState<Category>('all');
  const [feedMode, setFeedMode] = useState<'all' | 'for-you' | 'trending' | 'saved'>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [personalizeModalOpen, setPersonalizeModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [offlineManagerOpen, setOfflineManagerOpen] = useState(false);
  const [shareModalArticle, setShareModalArticle] = useState<Article | null>(null);
  const [activePushToast, setActivePushToast] = useState<PushNotification | null>(null);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

  // Article CRUD Operations for Bureau Admin
  const handleAddArticle = (newArticle: Article) => {
    setArticles((prev) => [newArticle, ...prev]);
  };

  const handleUpdateArticle = (updatedArticle: Article) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
    );
    if (selectedArticle?.id === updatedArticle.id) {
      setSelectedArticle(updatedArticle);
    }
  };

  const handleDeleteArticle = (articleId: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== articleId));
    if (selectedArticle?.id === articleId) {
      setSelectedArticle(null);
    }
    setSavedArticleIds((prev) => prev.filter((id) => id !== articleId));
  };

  // Flash News Management Operations for Bureau Admin
  const handleAddFlashNews = (item: FlashNewsItem) => {
    setFlashNews((prev) => [item, ...prev]);
  };

  const handleUpdateFlashNews = (updatedItem: FlashNewsItem) => {
    setFlashNews((prev) =>
      prev.map((f) => (f.id === updatedItem.id ? updatedItem : f))
    );
  };

  const handleDeleteFlashNews = (id: string) => {
    setFlashNews((prev) => prev.filter((f) => f.id !== id));
  };

  const handleToggleFlashNewsActive = (id: string) => {
    setFlashNews((prev) =>
      prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f))
    );
  };

  const handleReorderFlashNews = (items: FlashNewsItem[]) => {
    setFlashNews(items);
  };

  // Browser Web Push API status
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission | 'unsupported'>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserPermission(Notification.permission);
    } else {
      setBrowserPermission('unsupported');
    }
  }, []);

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission();
      setBrowserPermission(res);
    }
  };

  // Keyboard shortcut listener for Search ('/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !searchModalOpen && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setPersonalizeModalOpen(false);
        setNotificationsOpen(false);
        setOfflineManagerOpen(false);
        setShareModalArticle(null);
        setAdminDashboardOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen]);

  // Offline bookmark toggle
  const handleToggleSaveOffline = (article: Article, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedArticleIds((prev) => {
      if (prev.includes(article.id)) {
        return prev.filter((id) => id !== article.id);
      } else {
        return [...prev, article.id];
      }
    });
  };

  const savedArticlesList = useMemo(() => {
    return articles.filter((a) => savedArticleIds.includes(a.id));
  }, [articles, savedArticleIds]);

  // Real-time Push alert simulator
  const handleSimulatePushAlert = () => {
    const breakingHeadlines = [
      {
        title: 'BREAKING: Historic Energy Transition Pact Ratified',
        body: 'Over 80 sovereign signatories establish mandatory clean grid interconnects by 2030.',
        category: 'world' as Category,
        articleId: 'lead-story-1',
      },
      {
        title: 'POLITICAL WIRE: Emergency Fiscal Hearing Convenes',
        body: 'Downing Street and Brussels announce joint oversight committee on infrastructure procurement.',
        category: 'politics' as Category,
        articleId: 'pol-lead-1',
      },
      {
        title: 'TECH PULSE: Superconducting Quantum Mesh Deployed',
        body: 'Delft consortium achieves fault-tolerant topological interconnect across distributed data centers.',
        category: 'tech' as Category,
        articleId: 'tech-1',
      },
    ];

    const pick = breakingHeadlines[Math.floor(Math.random() * breakingHeadlines.length)];
    const newAlert: PushNotification = {
      id: 'notif_' + Date.now(),
      title: pick.title,
      body: pick.body,
      category: pick.category,
      timestamp: 'Just now',
      read: false,
      articleId: pick.articleId,
      priority: 'breaking',
    };

    setNotifications((prev) => [newAlert, ...prev]);
    setActivePushToast(newAlert);

    // If browser permission is granted, trigger real system Web Push notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(newAlert.title, {
          body: newAlert.body,
          icon: '/favicon.ico',
        });
      } catch (err) {
        // silently fallback to in-app toast
      }
    }
  };

  // Comments handlers
  const handleAddComment = (articleId: string, authorName: string, content: string, parentId?: string) => {
    setComments((prev) => addCommentToThread(prev, articleId, { authorName, content, parentId }));
  };

  const handleToggleCommentUpvote = (commentId: string) => {
    setComments((prev) => toggleCommentUpvote(prev, commentId));
  };

  // Filtered Articles based on Feed Mode & Category
  const displayedArticles = useMemo(() => {
    if (isSimulatedOffline) {
      // In offline mode, only saved articles are available
      return savedArticlesList;
    }

    if (feedMode !== 'all') {
      return filterArticlesByPersonalizedFeed(articles, preferences, feedMode, savedArticleIds);
    }

    if (currentCategory !== 'all') {
      return articles.filter((a) => a.category.toLowerCase() === currentCategory.toLowerCase());
    }

    return articles;
  }, [articles, feedMode, currentCategory, preferences, savedArticleIds, isSimulatedOffline, savedArticlesList]);

  // Layout slots for the front page (matching the user's reference image)
  const isFrontPage = currentCategory === 'all' && feedMode === 'all' && !isSimulatedOffline;

  const leadStory = articles.find((a) => a.id === 'lead-story-1') || articles[0];
  const heroLeftArticles = articles.filter((a) => a.id === 'hero-left-1' || a.id === 'hero-left-2');
  const heroRightArticle = articles.find((a) => a.id === 'hero-right-1') || articles[3];

  const businessArticles = articles.filter((a) => a.category === 'business');
  const politicsLead = articles.find((a) => a.id === 'pol-lead-1') || articles.find((a) => a.category === 'politics');
  const politicsSideList = articles.filter((a) => a.category === 'politics' && a.id !== politicsLead?.id).slice(0, 4);
  const travelArticles = articles.filter((a) => a.category === 'travel');

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* 1. SIMULATED OFFLINE BANNER (if active) */}
      {isSimulatedOffline && (
        <div className="bg-amber-600 text-white text-xs py-2 px-4 text-center font-bold font-sans flex items-center justify-center gap-2 shadow-sm">
          <WifiOff className="w-4 h-4" />
          <span>SIMULATED OFFLINE MODE ACTIVE — Browsing locally cached stories from your browser storage.</span>
          <button
            onClick={() => setIsSimulatedOffline(false)}
            className="underline ml-2 hover:text-amber-100"
          >
            Turn Off
          </button>
        </div>
      )}

      {/* 2. RESPONSIVE HEADER WITH MEGA MENUS & CONTROLS */}
      <Header
        currentCategory={currentCategory}
        feedMode={feedMode}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setFeedMode('all');
        }}
        onSelectFeedMode={(mode) => {
          setFeedMode(mode);
          setCurrentCategory('all');
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenOfflineManager={() => setOfflineManagerOpen(true)}
        onOpenPersonalizeModal={() => setPersonalizeModalOpen(true)}
        onOpenAdminDashboard={() => setAdminDashboardOpen(true)}
        unreadNotificationsCount={unreadNotifsCount}
        savedOfflineCount={savedArticleIds.length}
        isSimulatedOffline={isSimulatedOffline}
        flashNews={flashNews}
        onSelectArticleById={(artId) => {
          const match = articles.find((a) => a.id === artId);
          if (match) setSelectedArticle(match);
        }}
      />

      {/* 3. MAIN CONTENT CANVAS */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8">
        {/* A. If in a specific Category or Feed Mode (Personalized / Trending / Saved) */}
        {!isFrontPage ? (
          <div>
            <div className="pb-6 mb-8 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 font-bold mb-1">
                  <span>DISPATCH INDEX</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-800 dark:text-stone-200">
                    {feedMode === 'for-you'
                      ? 'Personalized For You'
                      : feedMode === 'trending'
                      ? 'Trending Pulse'
                      : feedMode === 'saved'
                      ? 'Saved Offline Library'
                      : isSimulatedOffline
                      ? 'Offline Cache'
                      : `Desk: ${currentCategory}`}
                  </span>
                </div>
                <h2 className="font-editorial-headline text-3xl sm:text-4xl font-extrabold capitalize text-stone-900 dark:text-stone-50">
                  {feedMode === 'for-you'
                    ? 'Your Personalized Daily Dispatch'
                    : feedMode === 'trending'
                    ? 'Most Discussed & High-Pulse Stories'
                    : feedMode === 'saved'
                    ? 'Offline Reading Vault'
                    : currentCategory}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {feedMode === 'for-you' && (
                  <button
                    onClick={() => setPersonalizeModalOpen(true)}
                    className="px-3 py-1.5 border border-stone-300 dark:border-stone-700 text-xs font-semibold rounded-sm hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Adjust Preferences</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setCurrentCategory('all');
                    setFeedMode('all');
                  }}
                  className="px-3 py-1.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold rounded-sm hover:bg-stone-800 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>View All Home Sections</span>
                </button>
              </div>
            </div>

            {displayedArticles.length === 0 ? (
              <div className="py-20 text-center text-stone-500">
                <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <h3 className="font-editorial-headline text-xl font-bold mb-1">No articles found in this view</h3>
                <p className="text-xs font-sans text-stone-400">
                  {feedMode === 'saved'
                    ? 'Save stories by clicking the bookmark icon on any headline.'
                    : 'Try selecting a different topic or resetting filters.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {displayedArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="grid-5"
                    onSelectArticle={(art) => setSelectedArticle(art)}
                    isSavedOffline={savedArticleIds.includes(article.id)}
                    onToggleSaveOffline={handleToggleSaveOffline}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* B. GRAND FRONT PAGE (Closely matching the attached reference layout) */
          <div className="space-y-16">
            {/* 1. TOP HERO SECTION: 3 COLUMNS (Left stacked, Center grand portrait lead, Right half post) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-12 border-b border-stone-200 dark:border-stone-800">
              {/* Left Column (2 Stacked vertical stories) */}
              <div className="lg:col-span-3 flex flex-col justify-between space-y-6 lg:border-r border-stone-200 dark:border-stone-800 lg:pr-8">
                {heroLeftArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="hero-stacked"
                    onSelectArticle={(art) => setSelectedArticle(art)}
                    isSavedOffline={savedArticleIds.includes(article.id)}
                    onToggleSaveOffline={handleToggleSaveOffline}
                  />
                ))}
              </div>

              {/* Center Column: Grand Lead Feature (using user's uploaded portrait image) */}
              <div className="lg:col-span-6 flex flex-col justify-between px-0 lg:px-4">
                <ArticleCard
                  article={leadStory}
                  variant="hero-lead"
                  onSelectArticle={(art) => setSelectedArticle(art)}
                  isSavedOffline={savedArticleIds.includes(leadStory.id)}
                  onToggleSaveOffline={handleToggleSaveOffline}
                />
              </div>

              {/* Right Column: Hero-Half Post */}
              <div className="lg:col-span-3 flex flex-col justify-between lg:border-l border-stone-200 dark:border-stone-800 lg:pl-8">
                <ArticleCard
                  article={heroRightArticle}
                  variant="hero-half"
                  onSelectArticle={(art) => setSelectedArticle(art)}
                  isSavedOffline={savedArticleIds.includes(heroRightArticle.id)}
                  onToggleSaveOffline={handleToggleSaveOffline}
                />
              </div>
            </section>

            {/* 2. BUSINESS SECTION: 5-COLUMN EDITORIAL STRIP */}
            <section className="pb-12 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-stone-900 dark:border-stone-100">
                <h2 className="font-editorial-headline text-xl sm:text-2xl font-black tracking-wider uppercase text-stone-900 dark:text-stone-100">
                  Business
                </h2>
                <button
                  onClick={() => setCurrentCategory('business')}
                  className="text-xs uppercase tracking-widest font-sans font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1"
                >
                  <span>All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {businessArticles.slice(0, 5).map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="grid-5"
                    onSelectArticle={(art) => setSelectedArticle(art)}
                    isSavedOffline={savedArticleIds.includes(article.id)}
                    onToggleSaveOffline={handleToggleSaveOffline}
                  />
                ))}
              </div>
            </section>

            {/* 3. POLITICS SECTION: ASYMMETRIC SPLIT (Lead on left, 4 compact on right) */}
            <section className="pb-12 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-stone-900 dark:border-stone-100">
                <h2 className="font-editorial-headline text-xl sm:text-2xl font-black tracking-wider uppercase text-stone-900 dark:text-stone-100">
                  Politics
                </h2>
                <button
                  onClick={() => setCurrentCategory('politics')}
                  className="text-xs uppercase tracking-widest font-sans font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1"
                >
                  <span>All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Large Lead Story */}
                <div className="lg:col-span-7">
                  {politicsLead && (
                    <ArticleCard
                      article={politicsLead}
                      variant="politics-lead"
                      onSelectArticle={(art) => setSelectedArticle(art)}
                      isSavedOffline={savedArticleIds.includes(politicsLead.id)}
                      onToggleSaveOffline={handleToggleSaveOffline}
                    />
                  )}
                </div>

                {/* Right Stacked 4 Compact Items */}
                <div className="lg:col-span-5 divide-y divide-stone-200 dark:divide-stone-800">
                  {politicsSideList.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="politics-side"
                      onSelectArticle={(art) => setSelectedArticle(art)}
                      isSavedOffline={savedArticleIds.includes(article.id)}
                      onToggleSaveOffline={handleToggleSaveOffline}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 4. TRAVEL & LANDSCAPES SECTION: 5-COLUMN GALLERY CARDS */}
            <section className="pb-12 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-stone-900 dark:border-stone-100">
                <h2 className="font-editorial-headline text-xl sm:text-2xl font-black tracking-wider uppercase text-stone-900 dark:text-stone-100">
                  Travel
                </h2>
                <button
                  onClick={() => setCurrentCategory('travel')}
                  className="text-xs uppercase tracking-widest font-sans font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1"
                >
                  <span>All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {travelArticles.slice(0, 5).map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="grid-5"
                    onSelectArticle={(art) => setSelectedArticle(art)}
                    isSavedOffline={savedArticleIds.includes(article.id)}
                    onToggleSaveOffline={handleToggleSaveOffline}
                  />
                ))}
              </div>
            </section>

            {/* 5. EDITORIAL PULSE NEWSLETTER STRIP (Retention Feature) */}
            <section className="bg-stone-100 dark:bg-stone-900 p-8 sm:p-12 border border-stone-200 dark:border-stone-800 text-center max-w-3xl mx-auto rounded-sm">
              <span className="text-[10px] font-sans uppercase font-bold tracking-[0.25em] text-stone-500 block mb-2">
                The Morning Broadsheet
              </span>
              <h3 className="font-editorial-headline text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3">
                Receive the NewsPulse Daily Briefing
              </h3>
              <p className="font-editorial-body text-sm text-stone-600 dark:text-stone-400 mb-6 max-w-lg mx-auto">
                Carefully edited by human correspondents every morning at 06:00 GMT. No clickbait or algorithmic noise.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you for subscribing to the NewsPulse Morning Broadsheet.');
                }}
                className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full sm:flex-1 px-4 py-2.5 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-sans focus:outline-none rounded-sm text-stone-900 dark:text-stone-100"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-sans font-bold uppercase tracking-wider rounded-sm hover:bg-stone-800"
                >
                  Subscribe
                </button>
              </form>
            </section>
          </div>
        )}
      </main>

      {/* 4. FOOTER */}
      <Footer
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setFeedMode('all');
        }}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenOfflineManager={() => setOfflineManagerOpen(true)}
        onOpenPersonalizeModal={() => setPersonalizeModalOpen(true)}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
        onOpenAdminDashboard={() => setAdminDashboardOpen(true)}
      />

      {/* 5. MODALS & POPUPS */}
      {/* Full Article Reader */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleDetailModal
            key="article-detail-modal"
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
            comments={comments}
            onAddComment={handleAddComment}
            onToggleCommentUpvote={handleToggleCommentUpvote}
            isSavedOffline={savedArticleIds.includes(selectedArticle.id)}
            onToggleSaveOffline={(art) => handleToggleSaveOffline(art)}
            onOpenShareModal={(art) => setShareModalArticle(art)}
            preferences={preferences}
          />
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        articles={articles}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

      {/* Personalize Feed Modal */}
      <PersonalizeFeedModal
        isOpen={personalizeModalOpen}
        onClose={() => setPersonalizeModalOpen(false)}
        preferences={preferences}
        onSavePreferences={(updated) => setPreferences(updated)}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
        }}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onClearAll={() => setNotifications([])}
        onSimulatePushAlert={handleSimulatePushAlert}
        onSelectArticleById={(artId) => {
          const match = articles.find((a) => a.id === artId);
          if (match) setSelectedArticle(match);
        }}
        onRequestBrowserPermission={requestBrowserPermission}
        browserPermission={browserPermission}
      />

      {/* Offline Reading Library */}
      <OfflineManagerModal
        isOpen={offlineManagerOpen}
        onClose={() => setOfflineManagerOpen(false)}
        savedArticles={savedArticlesList}
        onSelectArticle={(art) => setSelectedArticle(art)}
        onRemoveFromOffline={(id, e) => {
          setSavedArticleIds((prev) => prev.filter((i) => i !== id));
        }}
        onClearAllOffline={() => setSavedArticleIds([])}
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
      />

      {/* Social Media Share Modal */}
      <ShareModal
        isOpen={!!shareModalArticle}
        onClose={() => setShareModalArticle(null)}
        article={shareModalArticle}
      />

      {/* Real-time Push Notification Toast Popup */}
      <PushToast
        notification={activePushToast}
        onClose={() => setActivePushToast(null)}
        onReadArticle={(artId) => {
          const match = articles.find((a) => a.id === artId);
          if (match) setSelectedArticle(match);
        }}
      />

      {/* Editorial Bureau Admin Dashboard (Secured with credentials, relocated analytics & flash ticker desk) */}
      <AdminDashboardModal
        isOpen={adminDashboardOpen}
        onClose={() => setAdminDashboardOpen(false)}
        articles={articles}
        onAddArticle={handleAddArticle}
        onUpdateArticle={handleUpdateArticle}
        onDeleteArticle={handleDeleteArticle}
        onSelectArticleForPreview={(art) => setSelectedArticle(art)}
        flashNews={flashNews}
        onAddFlashNews={handleAddFlashNews}
        onUpdateFlashNews={handleUpdateFlashNews}
        onDeleteFlashNews={handleDeleteFlashNews}
        onToggleFlashNewsActive={handleToggleFlashNewsActive}
        onReorderFlashNews={handleReorderFlashNews}
      />
    </div>
  );
}
