import { Article, Category, Comment, DateFilterType, UserPreferences } from '../types';

export function filterArticlesBySearch(
  articles: Article[],
  options: {
    query?: string;
    category?: Category;
    dateFilter?: DateFilterType;
    customStartDate?: string;
    customEndDate?: string;
    currentReferenceDate?: Date;
  }
): Article[] {
  const {
    query = '',
    category = 'all',
    dateFilter = 'all',
    customStartDate,
    customEndDate,
    currentReferenceDate = new Date(),
  } = options;

  const normalizedQuery = query.trim().toLowerCase();

  return articles.filter((article) => {
    // 1. Category check
    if (category !== 'all' && article.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    // 2. Query check (title, excerpt, tags, author, content blocks)
    if (normalizedQuery) {
      const matchTitle = article.title.toLowerCase().includes(normalizedQuery);
      const matchExcerpt = article.excerpt.toLowerCase().includes(normalizedQuery);
      const matchAuthor = article.author.name.toLowerCase().includes(normalizedQuery);
      const matchTags = article.tags.some((t) => t.toLowerCase().includes(normalizedQuery));
      const matchContent = article.content.some((b) => b.text.toLowerCase().includes(normalizedQuery));

      if (!matchTitle && !matchExcerpt && !matchAuthor && !matchTags && !matchContent) {
        return false;
      }
    }

    // 3. Date filtering
    if (dateFilter !== 'all') {
      const articleDate = new Date(article.publishedAt);
      if (isNaN(articleDate.getTime())) return true; // Keep if unparseable

      const now = currentReferenceDate.getTime();
      const articleTime = articleDate.getTime();
      const diffHours = (now - articleTime) / (1000 * 60 * 60);

      if (dateFilter === 'today') {
        // Within last 24 hours or same calendar day
        const isSameDay =
          articleDate.getUTCFullYear() === currentReferenceDate.getUTCFullYear() &&
          articleDate.getUTCMonth() === currentReferenceDate.getUTCMonth() &&
          articleDate.getUTCDate() === currentReferenceDate.getUTCDate();
        if (!isSameDay && diffHours > 36) return false;
      } else if (dateFilter === 'week') {
        // Within last 7 days
        if (diffHours > 24 * 7) return false;
      } else if (dateFilter === 'month') {
        // Within last 30 days
        if (diffHours > 24 * 31) return false;
      } else if (dateFilter === 'custom') {
        if (customStartDate && new Date(customStartDate).getTime() > articleTime) {
          return false;
        }
        if (customEndDate && new Date(customEndDate).getTime() < articleTime) {
          return false;
        }
      }
    }

    return true;
  });
}

export function filterArticlesByPersonalizedFeed(
  articles: Article[],
  preferences: UserPreferences,
  feedMode: 'all' | 'for-you' | 'trending' | 'saved',
  savedArticleIds: string[] = []
): Article[] {
  if (feedMode === 'saved') {
    return articles.filter((a) => savedArticleIds.includes(a.id));
  }

  if (feedMode === 'trending') {
    return [...articles].sort((a, b) => (b.upvotesCount + b.commentsCount * 2) - (a.upvotesCount + a.commentsCount * 2));
  }

  if (feedMode === 'for-you') {
    const selected = preferences.selectedTopics;
    if (!selected || selected.length === 0 || selected.includes('all')) {
      return articles;
    }

    // Score and rank based on user topics
    const prioritized = articles.filter((a) => selected.includes(a.category));
    const others = articles.filter((a) => !selected.includes(a.category));
    return [...prioritized, ...others];
  }

  return articles;
}

export function toggleCommentUpvote(comments: Comment[], commentId: string): Comment[] {
  return comments.map((comment) => {
    if (comment.id === commentId) {
      const isUpvoted = !!comment.userUpvoted;
      return {
        ...comment,
        userUpvoted: !isUpvoted,
        upvotes: isUpvoted ? Math.max(0, comment.upvotes - 1) : comment.upvotes + 1,
      };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: toggleCommentUpvote(comment.replies, commentId),
      };
    }
    return comment;
  });
}

export function addCommentToThread(
  comments: Comment[],
  articleId: string,
  newComment: {
    authorName: string;
    content: string;
    parentId?: string;
  }
): Comment[] {
  const createdComment: Comment = {
    id: 'cmt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    articleId,
    authorName: newComment.authorName.trim() || 'Anonymous Reader',
    content: newComment.content.trim(),
    timestamp: 'Just now',
    upvotes: 0,
    userUpvoted: false,
    parentId: newComment.parentId,
    replies: [],
  };

  if (!newComment.parentId) {
    return [createdComment, ...comments];
  }

  function appendReply(list: Comment[]): Comment[] {
    return list.map((item) => {
      if (item.id === newComment.parentId) {
        return {
          ...item,
          replies: [...(item.replies || []), createdComment],
        };
      }
      if (item.replies && item.replies.length > 0) {
        return {
          ...item,
          replies: appendReply(item.replies),
        };
      }
      return item;
    });
  }

  return appendReply(comments);
}

export function formatEditorialDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[d.getUTCMonth()];
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${month} ${day}`;
  } catch {
    return dateStr;
  }
}
