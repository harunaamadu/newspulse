import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  X,
  Eye,
  LogOut,
  AlertCircle,
  CheckCircle,
  Search,
  Filter,
  BarChart3,
  FileText,
  Newspaper,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  ArrowUp,
  ArrowDown,
  ToggleLeft,
  ToggleRight,
  Link2,
} from 'lucide-react';
import { Article, Category, ArticleContentBlock, FlashNewsItem } from '../types';
import { ReaderEngagementChart } from './ReaderEngagementChart';
import { FlashNewsCarousel } from './FlashNewsCarousel';
import { formatEditorialDate } from '../utils/newsUtils';

const ADMIN_USERNAME = 'newspulseadmin@newsplus.news';
const ADMIN_PASSWORD = 'admin@1234';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onAddArticle: (article: Article) => void;
  onUpdateArticle: (article: Article) => void;
  onDeleteArticle: (articleId: string) => void;
  onSelectArticleForPreview: (article: Article) => void;
  flashNews: FlashNewsItem[];
  onAddFlashNews: (item: FlashNewsItem) => void;
  onUpdateFlashNews: (item: FlashNewsItem) => void;
  onDeleteFlashNews: (id: string) => void;
  onToggleFlashNewsActive: (id: string) => void;
  onReorderFlashNews?: (items: FlashNewsItem[]) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  articles,
  onAddArticle,
  onUpdateArticle,
  onDeleteArticle,
  onSelectArticleForPreview,
  flashNews,
  onAddFlashNews,
  onUpdateFlashNews,
  onDeleteFlashNews,
  onToggleFlashNewsActive,
  onReorderFlashNews,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('newspulse_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab: 'analytics' | 'articles' | 'flash'
  const [activeTab, setActiveTab] = useState<'analytics' | 'articles' | 'flash'>('articles');

  // Search & Filter state for articles list
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category>('all');

  // Modal / Form state for Add/Edit
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formCategory, setFormCategory] = useState<Category>('politics');
  const [formSource, setFormSource] = useState('NewsPulse Bureau');
  const [formAuthorName, setFormAuthorName] = useState('');
  const [formAuthorRole, setFormAuthorRole] = useState('Staff Correspondent');
  const [formLocation, setFormLocation] = useState('GENEVA —');
  const [formReadTime, setFormReadTime] = useState(5);
  const [formTags, setFormTags] = useState('');
  const [formIsBreaking, setFormIsBreaking] = useState(false);
  const [formIsTrending, setFormIsTrending] = useState(false);
  const [formBodyText, setFormBodyText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  // Delete Confirmation State
  const [articlePendingDelete, setArticlePendingDelete] = useState<Article | null>(null);

  // Flash News State & Form Fields
  const [isFlashEditorOpen, setIsFlashEditorOpen] = useState(false);
  const [editingFlashId, setEditingFlashId] = useState<string | null>(null);
  const [flashFormText, setFlashFormText] = useState('');
  const [flashFormCategory, setFlashFormCategory] = useState<string>('world');
  const [flashFormUrgent, setFlashFormUrgent] = useState(false);
  const [flashFormActive, setFlashFormActive] = useState(true);
  const [flashFormArticleId, setFlashFormArticleId] = useState<string>('');
  const [flashFormError, setFlashFormError] = useState<string | null>(null);
  const [flashItemPendingDelete, setFlashItemPendingDelete] = useState<FlashNewsItem | null>(null);

  if (!isOpen) return null;

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === ADMIN_USERNAME && passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(null);
      try {
        localStorage.setItem('newspulse_admin_auth', 'true');
      } catch {
        // ignore
      }
    } else {
      setAuthError('Invalid credentials. Check username and password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('newspulse_admin_auth');
    } catch {
      // ignore
    }
  };

  const handleFillDemoCreds = () => {
    setUsernameInput(ADMIN_USERNAME);
    setPasswordInput(ADMIN_PASSWORD);
    setAuthError(null);
  };

  // Open Editor for Creating New Article
  const handleOpenCreate = () => {
    setEditingArticleId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormExcerpt('');
    setFormCategory('politics');
    setFormSource('NewsPulse Bureau');
    setFormAuthorName('Alexandre Vance');
    setFormAuthorRole('Investigative Bureau Chief');
    setFormLocation('BRUSSELS —');
    setFormReadTime(4);
    setFormTags('Diplomacy, Policy, Investigation');
    setFormIsBreaking(false);
    setFormIsTrending(false);
    setFormBodyText(
      'Senior diplomatic envoys reached consensus this morning on regulatory oversight standards.\n\n' +
      'The multi-lateral working group affirmed that verifiable human reporting remains the cornerstone of democratic governance.'
    );
    setFormError(null);
    setIsEditorOpen(true);
  };

  // Open Editor for Updating Existing Article
  const handleOpenEdit = (article: Article) => {
    setEditingArticleId(article.id);
    setFormTitle(article.title);
    setFormSubtitle(article.subtitle || '');
    setFormExcerpt(article.excerpt);
    setFormCategory(article.category);
    setFormSource(article.source || 'NewsPulse Bureau');
    setFormAuthorName(article.author.name);
    setFormAuthorRole(article.author.role);
    setFormLocation(article.locationStamp || '');
    setFormReadTime(article.readTime);
    setFormTags(article.tags.join(', '));
    setFormIsBreaking(!!article.isBreaking);
    setFormIsTrending(!!article.isTrending);

    // Convert content blocks to readable text
    const textRepresentation = article.content
      .map((b) => (b.type === 'heading' ? `### ${b.text}` : b.text))
      .join('\n\n');
    setFormBodyText(textRepresentation);
    setFormError(null);
    setIsEditorOpen(true);
  };

  // Submit Article (Create or Update)
  const handleSubmitArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Article headline is required.');
      return;
    }
    if (!formSource.trim()) {
      setFormError('Article wire/bureau source is required.');
      return;
    }
    if (!formExcerpt.trim()) {
      setFormError('Lead excerpt is required.');
      return;
    }

    // Split body into paragraph / heading blocks
    const rawParagraphs = formBodyText.split(/\n\s*\n/).filter((p) => p.trim());
    const contentBlocks: ArticleContentBlock[] = rawParagraphs.map((para) => {
      const clean = para.trim();
      if (clean.startsWith('### ')) {
        return { type: 'heading', text: clean.replace(/^###\s*/, '') };
      }
      return { type: 'paragraph', text: clean };
    });

    if (contentBlocks.length === 0) {
      contentBlocks.push({ type: 'paragraph', text: formExcerpt });
    }

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingArticleId) {
      // UPDATE ARTICLE
      const existing = articles.find((a) => a.id === editingArticleId);
      if (!existing) return;

      const updated: Article = {
        ...existing,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        excerpt: formExcerpt.trim(),
        category: formCategory,
        source: formSource.trim(),
        author: {
          ...existing.author,
          name: formAuthorName.trim() || 'NewsPulse Staff',
          role: formAuthorRole.trim() || 'Contributor',
        },
        locationStamp: formLocation.trim() || undefined,
        readTime: Number(formReadTime) || 4,
        tags: tagsArray.length > 0 ? tagsArray : ['Dispatch'],
        isBreaking: formIsBreaking,
        isTrending: formIsTrending,
        content: contentBlocks,
      };

      onUpdateArticle(updated);
      setFeedbackNotice(`Article "${updated.title.slice(0, 35)}..." successfully updated.`);
    } else {
      // CREATE NEW ARTICLE
      const newArticle: Article = {
        id: 'art_' + Date.now(),
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        excerpt: formExcerpt.trim(),
        category: formCategory,
        source: formSource.trim(),
        author: {
          name: formAuthorName.trim() || 'NewsPulse Bureau',
          role: formAuthorRole.trim() || 'Staff Correspondent',
          avatar: '',
        },
        publishedAt: new Date().toISOString(),
        readTime: Number(formReadTime) || 4,
        imageUrl: '',
        imageCaption: `Editorial photo source: ${formSource.trim()}`,
        content: contentBlocks,
        tags: tagsArray.length > 0 ? tagsArray : ['News'],
        isBreaking: formIsBreaking,
        isTrending: formIsTrending,
        commentsCount: 0,
        upvotesCount: 0,
        locationStamp: formLocation.trim() || undefined,
      };

      onAddArticle(newArticle);
      setFeedbackNotice(`New article "${newArticle.title.slice(0, 35)}..." published with source "${newArticle.source}".`);
    }

    setIsEditorOpen(false);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  // Delete Article Action
  const handleConfirmDelete = () => {
    if (articlePendingDelete) {
      onDeleteArticle(articlePendingDelete.id);
      setFeedbackNotice(`Deleted article "${articlePendingDelete.title.slice(0, 35)}..."`);
      setArticlePendingDelete(null);
      setTimeout(() => setFeedbackNotice(null), 4000);
    }
  };

  // Flash News Handlers
  const handleOpenCreateFlash = () => {
    setEditingFlashId(null);
    setFlashFormText('');
    setFlashFormCategory('world');
    setFlashFormUrgent(true);
    setFlashFormActive(true);
    setFlashFormArticleId('');
    setFlashFormError(null);
    setIsFlashEditorOpen(true);
  };

  const handleOpenEditFlash = (item: FlashNewsItem) => {
    setEditingFlashId(item.id);
    setFlashFormText(item.text);
    setFlashFormCategory(item.category || 'world');
    setFlashFormUrgent(!!item.urgent);
    setFlashFormActive(item.active);
    setFlashFormArticleId(item.articleId || '');
    setFlashFormError(null);
    setIsFlashEditorOpen(true);
  };

  const handleSubmitFlash = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flashFormText.trim()) {
      setFlashFormError('Flash dispatch text is required.');
      return;
    }

    if (editingFlashId) {
      const existing = flashNews.find((f) => f.id === editingFlashId);
      if (!existing) return;
      const updated: FlashNewsItem = {
        ...existing,
        text: flashFormText.trim(),
        category: flashFormCategory,
        urgent: flashFormUrgent,
        active: flashFormActive,
        articleId: flashFormArticleId ? flashFormArticleId : undefined,
      };
      onUpdateFlashNews(updated);
      setFeedbackNotice(`Flash dispatch "${updated.text.slice(0, 35)}..." updated.`);
    } else {
      const newItem: FlashNewsItem = {
        id: 'flash-' + Date.now(),
        text: flashFormText.trim(),
        category: flashFormCategory,
        urgent: flashFormUrgent,
        active: flashFormActive,
        articleId: flashFormArticleId ? flashFormArticleId : undefined,
        timestamp: 'Just now',
      };
      onAddFlashNews(newItem);
      setFeedbackNotice(`New flash dispatch added to ticker.`);
    }

    setIsFlashEditorOpen(false);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const handleConfirmDeleteFlash = () => {
    if (flashItemPendingDelete) {
      onDeleteFlashNews(flashItemPendingDelete.id);
      setFeedbackNotice(`Flash dispatch removed.`);
      setFlashItemPendingDelete(null);
      setTimeout(() => setFeedbackNotice(null), 4000);
    }
  };

  const handleMoveFlash = (index: number, direction: 'up' | 'down') => {
    if (!onReorderFlashNews) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= flashNews.length) return;
    const reordered = [...flashNews];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    onReorderFlashNews(reordered);
  };

  // Filtered list of articles for management
  const filteredArticles = articles.filter((art) => {
    const matchesCategory = categoryFilter === 'all' || art.category === categoryFilter;
    const matchesQuery =
      searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.source && art.source.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-6xl max-h-[92vh] bg-stone-900 text-stone-100 border border-stone-800 shadow-2xl rounded-xs flex flex-col overflow-hidden my-auto">
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-black/60 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-800 rounded-xs text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-editorial-headline text-lg sm:text-xl font-bold text-stone-100">
                  NewsPulse Editorial Bureau Dashboard
                </h2>
                {isAuthenticated && (
                  <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-xs">
                    Secured
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 font-sans">
                Internal publication management & reader engagement telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs text-stone-400 hover:text-white border border-stone-700 hover:border-stone-500 rounded-xs transition-colors flex items-center gap-1.5 font-sans"
                title="Sign out of Admin Dashboard"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-xs transition-colors"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* FEEDBACK NOTICE BANNER */}
        {feedbackNotice && (
          <div className="px-6 py-2.5 bg-emerald-950/80 border-b border-emerald-800 text-emerald-300 text-xs font-sans flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{feedbackNotice}</span>
          </div>
        )}

        {/* CONTENT AREA: LOGIN vs DASHBOARD */}
        {!isAuthenticated ? (
          /* ────────────────────────────────────────────────────────── */
          /* 1. AUTHENTICATION LOGIN FORM */
          /* ────────────────────────────────────────────────────────── */
          <div className="p-6 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto w-full my-auto text-center font-sans">
            <div className="w-12 h-12 bg-stone-800 border border-stone-700 rounded-full flex items-center justify-center mb-4 text-stone-300">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="font-editorial-headline text-2xl font-bold text-stone-100 mb-1">
              Editorial Staff Sign-In
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Authorized credentials required to curate broadsheet dispatches and review telemetry.
            </p>

            {authError && (
              <div className="w-full mb-4 p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Bureau Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="newspulseadmin@newsplus.news"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-xs text-stone-100 focus:outline-none focus:border-stone-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                  Security Passcode
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-xs text-stone-100 focus:outline-none focus:border-stone-400 font-mono"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-stone-100 text-stone-950 font-bold hover:bg-white text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Authenticate Bureau Access</span>
                </button>

                <button
                  type="button"
                  onClick={handleFillDemoCreds}
                  className="w-full py-1.5 text-stone-400 hover:text-stone-200 text-xs border border-stone-800 hover:border-stone-700 rounded-xs transition-colors"
                >
                  Fill Assigned Bureau Credentials
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ────────────────────────────────────────────────────────── */
          /* 2. AUTHENTICATED ADMIN DASHBOARD */
          /* ────────────────────────────────────────────────────────── */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav Tabs Bar */}
            <div className="px-6 border-b border-stone-800 bg-black/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4 text-xs font-sans">
                <button
                  onClick={() => setActiveTab('articles')}
                  className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'articles'
                      ? 'border-stone-100 text-white'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Newspaper className="w-4 h-4" />
                  <span>Article Desk & Sources ({articles.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'analytics'
                      ? 'border-stone-100 text-white'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span>Reader Engagement Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('flash')}
                  className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === 'flash'
                      ? 'border-stone-100 text-white'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Flash News Ticker ({flashNews.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 my-2">
                {activeTab === 'articles' && (
                  <button
                    onClick={handleOpenCreate}
                    className="px-3 py-1.5 bg-stone-100 text-stone-950 font-bold text-xs rounded-xs hover:bg-white transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Publish New Article</span>
                  </button>
                )}

                {activeTab === 'flash' && (
                  <button
                    onClick={handleOpenCreateFlash}
                    className="px-3 py-1.5 bg-amber-400 text-stone-950 font-bold text-xs rounded-xs hover:bg-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Flash Dispatch</span>
                  </button>
                )}
              </div>
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'analytics' ? (
                /* RELOCATED READER ENGAGEMENT ANALYSIS */
                <div className="max-w-5xl mx-auto">
                  <div className="mb-4">
                    <span className="text-xs uppercase tracking-widest text-stone-400 font-sans font-bold">
                      Editorial Telemetry Room
                    </span>
                    <h3 className="font-editorial-headline text-2xl font-bold text-stone-100">
                      Reader Dwell Time & Drop-Off Telemetry
                    </h3>
                    <p className="text-xs text-stone-400 font-sans mt-0.5">
                      Confidential analytics measuring story completion, scroll depth drop-off curves, and wire source retention.
                    </p>
                  </div>

                  <ReaderEngagementChart />
                </div>
              ) : activeTab === 'flash' ? (
                /* FLASH NEWS DESK TAB */
                <div className="space-y-6">
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-amber-400 font-sans font-bold flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Real-Time Flash Ticker Desk</span>
                      </span>
                      <h3 className="font-editorial-headline text-2xl font-bold text-stone-100">
                        Top Navigation Bar Flash Carousel
                      </h3>
                      <p className="text-xs text-stone-400 font-sans mt-0.5">
                        Manage high-priority dispatches rotating across the top broadsheet navigation bar in real time.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono text-stone-400 bg-stone-950 border border-stone-800 px-3 py-1 rounded-xs">
                        <span className="text-emerald-400 font-bold">
                          {flashNews.filter((f) => f.active).length}
                        </span>{' '}
                        / {flashNews.length} active in carousel
                      </span>
                    </div>
                  </div>

                  {/* LIVE PREVIEW SIMULATION CARD */}
                  <div className="bg-black/80 border border-amber-900/40 rounded-xs p-4 shadow-inner">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        Live Top Navigation Bar Carousel Simulation
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        Auto-rotates every 5s · Pauses on cursor hover
                      </span>
                    </div>
                    <div className="py-2 px-3 bg-stone-950 border border-stone-800 rounded-xs">
                      <FlashNewsCarousel
                        items={flashNews}
                        onSelectArticleById={(artId) => {
                          const match = articles.find((a) => a.id === artId);
                          if (match) {
                            onSelectArticleForPreview(match);
                            onClose();
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* FLASH DISPATCHES TABLE */}
                  <div className="border border-stone-800 rounded-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans divide-y divide-stone-800">
                        <thead className="bg-black/60 text-stone-400 font-mono text-[11px] uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-3 w-16 text-center">Order</th>
                            <th className="py-3 px-3 w-28">Status</th>
                            <th className="py-3 px-3 w-24">Urgency</th>
                            <th className="py-3 px-3 w-24">Desk</th>
                            <th className="py-3 px-4">Flash Headline Dispatch</th>
                            <th className="py-3 px-3">Linked Story</th>
                            <th className="py-3 px-4 text-right w-24">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800/60 bg-stone-950/40">
                          {flashNews.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-stone-500">
                                No flash dispatches configured. Click "New Flash Dispatch" to add one.
                              </td>
                            </tr>
                          ) : (
                            flashNews.map((item, index) => {
                              const linkedArticle = item.articleId
                                ? articles.find((a) => a.id === item.articleId)
                                : null;

                              return (
                                <tr key={item.id} className="hover:bg-stone-900/60 transition-colors">
                                  {/* Order & Reorder arrows */}
                                  <td className="py-3 px-3 text-center">
                                    <div className="inline-flex items-center gap-1 font-mono text-[11px] text-stone-400">
                                      <span className="w-4 text-stone-500">{index + 1}</span>
                                      <div className="flex flex-col">
                                        <button
                                          type="button"
                                          disabled={index === 0}
                                          onClick={() => handleMoveFlash(index, 'up')}
                                          className={`p-0.5 rounded-xs ${
                                            index === 0
                                              ? 'opacity-20 cursor-not-allowed text-stone-600'
                                              : 'hover:bg-stone-800 text-stone-400 hover:text-white'
                                          }`}
                                          title="Move dispatch earlier in rotation"
                                        >
                                          <ArrowUp className="w-3 h-3" />
                                        </button>
                                        <button
                                          type="button"
                                          disabled={index === flashNews.length - 1}
                                          onClick={() => handleMoveFlash(index, 'down')}
                                          className={`p-0.5 rounded-xs ${
                                            index === flashNews.length - 1
                                              ? 'opacity-20 cursor-not-allowed text-stone-600'
                                              : 'hover:bg-stone-800 text-stone-400 hover:text-white'
                                          }`}
                                          title="Move dispatch later in rotation"
                                        >
                                          <ArrowDown className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Active / Hidden toggle */}
                                  <td className="py-3 px-3">
                                    <button
                                      type="button"
                                      onClick={() => onToggleFlashNewsActive(item.id)}
                                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs font-mono text-[10px] uppercase font-bold border transition-colors ${
                                        item.active
                                          ? 'bg-emerald-950/70 border-emerald-800 text-emerald-400 hover:bg-emerald-900/80'
                                          : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300'
                                      }`}
                                      title={item.active ? 'Click to pause/hide from carousel' : 'Click to enable in carousel'}
                                    >
                                      {item.active ? (
                                        <>
                                          <ToggleRight className="w-3.5 h-3.5 text-emerald-400" />
                                          <span>Active</span>
                                        </>
                                      ) : (
                                        <>
                                          <ToggleLeft className="w-3.5 h-3.5 text-stone-500" />
                                          <span>Hidden</span>
                                        </>
                                      )}
                                    </button>
                                  </td>

                                  {/* Urgency */}
                                  <td className="py-3 px-3">
                                    {item.urgent ? (
                                      <span className="font-mono text-[10px] uppercase tracking-wider font-bold bg-red-950/80 border border-red-800/80 text-red-300 px-2 py-0.5 rounded-xs inline-flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                        <span>Breaking</span>
                                      </span>
                                    ) : (
                                      <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500 bg-stone-900 px-2 py-0.5 rounded-xs">
                                        Routine
                                      </span>
                                    )}
                                  </td>

                                  {/* Desk */}
                                  <td className="py-3 px-3 font-mono text-[10px] uppercase tracking-wider text-stone-400">
                                    {item.category || 'World'}
                                  </td>

                                  {/* Text */}
                                  <td className="py-3 px-4">
                                    <div className="font-medium text-stone-100 text-xs line-clamp-2">
                                      {item.text}
                                    </div>
                                    {item.timestamp && (
                                      <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">
                                        Published {item.timestamp}
                                      </span>
                                    )}
                                  </td>

                                  {/* Linked Story */}
                                  <td className="py-3 px-3 max-w-xs">
                                    {linkedArticle ? (
                                      <div className="flex items-center gap-1.5">
                                        <Link2 className="w-3 h-3 text-blue-400 shrink-0" />
                                        <span
                                          onClick={() => {
                                            onSelectArticleForPreview(linkedArticle);
                                            onClose();
                                          }}
                                          className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline cursor-pointer truncate"
                                          title={`Click to read: ${linkedArticle.title}`}
                                        >
                                          {linkedArticle.title}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-stone-600 text-[11px] italic">
                                        Standalone ticker
                                      </span>
                                    )}
                                  </td>

                                  {/* Actions */}
                                  <td className="py-3 px-4 text-right">
                                    <div className="inline-flex items-center gap-1.5 justify-end">
                                      <button
                                        onClick={() => handleOpenEditFlash(item)}
                                        className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-white rounded-xs transition-colors"
                                        title="Edit Flash Dispatch"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setFlashItemPendingDelete(item)}
                                        className="p-1.5 hover:bg-red-950 text-stone-400 hover:text-red-300 rounded-xs transition-colors"
                                        title="Delete Flash Dispatch"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                /* ARTICLE MANAGEMENT (CRUD) TAB */
                <div>
                  {/* Search and Category Filter Strip */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 font-sans">
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
                      <div className="relative w-full">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                        <input
                          type="text"
                          placeholder="Search title, source, author, or excerpt..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-xs text-xs text-stone-200 focus:outline-none focus:border-stone-600"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Filter className="w-3.5 h-3.5 text-stone-500" />
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value as Category)}
                        className="px-3 py-2 bg-stone-950 border border-stone-800 rounded-xs text-xs text-stone-200 focus:outline-none"
                      >
                        <option value="all">All Desks</option>
                        <option value="politics">Politics</option>
                        <option value="business">Business</option>
                        <option value="tech">Tech & AI</option>
                        <option value="world">World</option>
                        <option value="travel">Travel</option>
                        <option value="culture">Culture</option>
                        <option value="opinion">Opinion</option>
                      </select>
                    </div>
                  </div>

                  {/* Articles Table */}
                  <div className="border border-stone-800 rounded-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans divide-y divide-stone-800">
                        <thead className="bg-black/60 text-stone-400 font-mono text-[11px] uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Headline / Story</th>
                            <th className="py-3 px-3">Desk</th>
                            <th className="py-3 px-3">Wire / Source</th>
                            <th className="py-3 px-3">Byline</th>
                            <th className="py-3 px-3">Date</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800/60 bg-stone-950/40">
                          {filteredArticles.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-stone-500">
                                No articles match the search query or filter.
                              </td>
                            </tr>
                          ) : (
                            filteredArticles.map((art) => (
                              <tr key={art.id} className="hover:bg-stone-900/60 transition-colors">
                                <td className="py-3.5 px-4 max-w-sm">
                                  <div className="font-semibold text-stone-100 line-clamp-1">
                                    {art.title}
                                  </div>
                                  <div className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                                    {art.excerpt}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    {art.isBreaking && (
                                      <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">
                                        Breaking
                                      </span>
                                    )}
                                    {art.isTrending && (
                                      <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">
                                        Trending
                                      </span>
                                    )}
                                  </div>
                                </td>

                                <td className="py-3.5 px-3 uppercase text-[10px] tracking-widest font-mono text-stone-300">
                                  {art.category}
                                </td>

                                <td className="py-3.5 px-3">
                                  <span className="font-mono text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-900/80 px-2 py-0.5 rounded-xs inline-block">
                                    {art.source || 'NewsPulse Bureau'}
                                  </span>
                                </td>

                                <td className="py-3.5 px-3 text-stone-300">
                                  <div>{art.author.name}</div>
                                  <div className="text-[10px] text-stone-500">{art.author.role}</div>
                                </td>

                                <td className="py-3.5 px-3 text-stone-400 text-[11px]">
                                  {formatEditorialDate(art.publishedAt)}
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  <div className="inline-flex items-center gap-1.5 justify-end">
                                    <button
                                      onClick={() => {
                                        onSelectArticleForPreview(art);
                                        onClose();
                                      }}
                                      className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-white rounded-xs transition-colors"
                                      title="Read in Public Reader"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleOpenEdit(art)}
                                      className="p-1.5 hover:bg-stone-800 text-stone-400 hover:text-white rounded-xs transition-colors"
                                      title="Edit Article & Source"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setArticlePendingDelete(art)}
                                      className="p-1.5 hover:bg-red-950 text-stone-400 hover:text-red-300 rounded-xs transition-colors"
                                      title="Delete Article"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* ADD / EDIT ARTICLE MODAL */}
        {/* ────────────────────────────────────────────────────────── */}
        {isEditorOpen && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-3xl bg-stone-900 border border-stone-700 shadow-2xl rounded-xs overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
              <div className="px-6 py-4 bg-black/80 border-b border-stone-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <h3 className="font-editorial-headline text-lg font-bold text-white">
                    {editingArticleId ? 'Update Editorial Article & Source' : 'Publish New Editorial Article'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitArticle} className="p-6 overflow-y-auto space-y-4 text-xs">
                {formError && (
                  <div className="p-3 bg-red-950/90 border border-red-800 text-red-200 rounded-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Headline */}
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                    Headline Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter investigative or dispatch headline..."
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 font-editorial-headline text-base focus:outline-none focus:border-stone-500"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                    Subtitle / Standfirst (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Secondary contextual summary..."
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 focus:outline-none focus:border-stone-500"
                  />
                </div>

                {/* Grid: Category & Source */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                      Editorial Desk (Category) *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as Category)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 focus:outline-none"
                    >
                      <option value="politics">Politics</option>
                      <option value="business">Business</option>
                      <option value="tech">Tech & AI</option>
                      <option value="world">World</option>
                      <option value="travel">Travel</option>
                      <option value="culture">Culture</option>
                      <option value="opinion">Opinion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                      Wire / Attribution Source *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Reuters, Associated Press, AFP, NewsPulse Bureau"
                      value={formSource}
                      onChange={(e) => setFormSource(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-emerald-700/80 rounded-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Grid: Author, Role, Location, ReadTime */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={formAuthorName}
                      onChange={(e) => setFormAuthorName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                      Author Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Foreign Correspondent"
                      value={formAuthorRole}
                      onChange={(e) => setFormAuthorRole(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                      Location Dateline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LONDON —"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                      Read Time (min)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={45}
                      value={formReadTime}
                      onChange={(e) => setFormReadTime(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                    Front-Page Lead Excerpt *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief introductory summary appearing in cards and search results..."
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 focus:outline-none focus:border-stone-500"
                  />
                </div>

                {/* Body Content */}
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                    Full Article Body (Separate paragraphs with double newlines; prefix headings with "### ")
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Write or paste full article dispatch text here..."
                    value={formBodyText}
                    onChange={(e) => setFormBodyText(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 font-mono text-xs focus:outline-none focus:border-stone-500 leading-relaxed"
                  />
                </div>

                {/* Tags and Flags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Energy, Finance, Geopolitics"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                      <input
                        type="checkbox"
                        checked={formIsBreaking}
                        onChange={(e) => setFormIsBreaking(e.target.checked)}
                        className="rounded-xs"
                      />
                      <span>Mark Breaking News</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                      <input
                        type="checkbox"
                        checked={formIsTrending}
                        onChange={(e) => setFormIsTrending(e.target.checked)}
                        className="rounded-xs"
                      />
                      <span>Mark Trending Story</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 border border-stone-700 text-stone-400 hover:text-white rounded-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-stone-100 text-stone-950 font-bold hover:bg-white rounded-xs flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{editingArticleId ? 'Save Changes' : 'Publish Article'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* DELETE CONFIRMATION MODAL */}
        {/* ────────────────────────────────────────────────────────── */}
        {articlePendingDelete && (
          <div className="fixed inset-0 z-70 bg-black/90 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-stone-900 border border-stone-800 p-6 rounded-xs shadow-2xl text-stone-100 font-sans">
              <div className="flex items-center gap-3 mb-4 text-red-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h4 className="font-editorial-headline text-lg font-bold text-white">
                  Confirm Article Deletion
                </h4>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed mb-6">
                Are you sure you want to permanently delete{' '}
                <span className="font-bold text-white">"{articlePendingDelete.title}"</span>?
                This will purge it from public newsroom desks, search archives, and reader offline libraries.
              </p>
              <div className="flex items-center justify-end gap-3 text-xs">
                <button
                  onClick={() => setArticlePendingDelete(null)}
                  className="px-4 py-2 border border-stone-700 text-stone-400 hover:text-white rounded-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xs flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Permanently</span>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* ────────────────────────────────────────────────────────── */}
        {/* ADD / EDIT FLASH DISPATCH MODAL */}
        {/* ────────────────────────────────────────────────────────── */}
        {isFlashEditorOpen && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-xl bg-stone-900 border border-amber-900/60 shadow-2xl rounded-xs overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
              <div className="px-6 py-4 bg-black/80 border-b border-stone-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-950 text-amber-400 rounded-xs border border-amber-800">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="font-editorial-headline text-lg font-bold text-white">
                    {editingFlashId ? 'Update Flash Dispatch' : 'New Top-Bar Flash Dispatch'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsFlashEditorOpen(false)}
                  className="p-1 text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitFlash} className="p-6 overflow-y-auto space-y-4 text-xs">
                {flashFormError && (
                  <div className="p-3 bg-red-950/90 border border-red-800 text-red-200 rounded-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{flashFormError}</span>
                  </div>
                )}

                {/* Dispatch text */}
                <div>
                  <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                    Flash Dispatch Headline *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Geneva accord establishes new benchmarks for verified algorithmic governance and sovereign audits..."
                    value={flashFormText}
                    onChange={(e) => setFlashFormText(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 font-editorial-headline text-sm focus:outline-none focus:border-amber-400 leading-snug"
                  />
                  <p className="text-[10px] text-stone-500 mt-1">
                    Keep concise for optimal visibility in top ticker carousel.
                  </p>
                </div>

                {/* Desk and Link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                      Desk Category
                    </label>
                    <select
                      value={flashFormCategory}
                      onChange={(e) => setFlashFormCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 focus:outline-none"
                    >
                      <option value="world">World</option>
                      <option value="politics">Politics</option>
                      <option value="business">Business</option>
                      <option value="tech">Tech & AI</option>
                      <option value="culture">Culture</option>
                      <option value="travel">Travel</option>
                      <option value="opinion">Opinion</option>
                      <option value="markets">Markets</option>
                    </select>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider font-semibold text-stone-400 mb-1">
                      Link to Full Article (Optional)
                    </label>
                    <select
                      value={flashFormArticleId}
                      onChange={(e) => setFlashFormArticleId(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-700 rounded-xs text-stone-100 focus:outline-none"
                    >
                      <option value="">None (Standalone Ticker)</option>
                      {articles.map((art) => (
                        <option key={art.id} value={art.id}>
                          {art.title.slice(0, 45)}...
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Flags */}
                <div className="pt-2 border-t border-stone-800 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-200">
                    <input
                      type="checkbox"
                      checked={flashFormUrgent}
                      onChange={(e) => setFlashFormUrgent(e.target.checked)}
                      className="rounded-xs text-red-500 focus:ring-0"
                    />
                    <span className="font-semibold text-red-300">
                      Flag as Urgent / Breaking (Displays red beacon & badge)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-stone-300">
                    <input
                      type="checkbox"
                      checked={flashFormActive}
                      onChange={(e) => setFlashFormActive(e.target.checked)}
                      className="rounded-xs text-emerald-500 focus:ring-0"
                    />
                    <span>
                      Active in rotation (Immediately broadcast to top navigation carousel)
                    </span>
                  </label>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFlashEditorOpen(false)}
                    className="px-4 py-2 border border-stone-700 text-stone-400 hover:text-white rounded-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-400 text-stone-950 font-bold hover:bg-amber-300 rounded-xs flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{editingFlashId ? 'Update Dispatch' : 'Broadcast to Carousel'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────── */}
        {/* DELETE FLASH DISPATCH CONFIRMATION MODAL */}
        {/* ────────────────────────────────────────────────────────── */}
        {flashItemPendingDelete && (
          <div className="fixed inset-0 z-70 bg-black/90 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-stone-900 border border-stone-800 p-6 rounded-xs shadow-2xl text-stone-100 font-sans">
              <div className="flex items-center gap-3 mb-4 text-red-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h4 className="font-editorial-headline text-lg font-bold text-white">
                  Remove Flash Dispatch
                </h4>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed mb-6">
                Are you sure you want to delete flash dispatch{' '}
                <span className="font-bold text-white">"{flashItemPendingDelete.text.slice(0, 50)}..."</span>?
                It will be immediately removed from the top navigation carousel.
              </p>
              <div className="flex items-center justify-end gap-3 text-xs">
                <button
                  onClick={() => setFlashItemPendingDelete(null)}
                  className="px-4 py-2 border border-stone-700 text-stone-400 hover:text-white rounded-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteFlash}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xs flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
