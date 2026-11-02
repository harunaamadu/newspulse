export type Category =
  | 'all'
  | 'business'
  | 'politics'
  | 'tech'
  | 'world'
  | 'travel'
  | 'culture'
  | 'opinion';

export interface Author {
  name: string;
  role: string;
  avatar: string;
}

export interface ArticleContentBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'image-caption';
  text: string;
  subtext?: string;
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: Category;
  author: Author;
  source?: string; // e.g. "Reuters", "Associated Press", "AFP", "NewsPulse Investigative Bureau"
  publishedAt: string; // ISO string or YYYY-MM-DD
  readTime: number; // in minutes
  imageUrl: string;
  imageCaption?: string;
  content: ArticleContentBlock[];
  tags: string[];
  isBreaking?: boolean;
  isTrending?: boolean;
  isLeadStory?: boolean;
  commentsCount: number;
  upvotesCount: number;
  locationStamp?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  upvotes: number;
  userUpvoted?: boolean;
  parentId?: string;
  replies?: Comment[];
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  category: Category;
  timestamp: string;
  read: boolean;
  articleId?: string;
  priority?: 'breaking' | 'trending' | 'standard';
}

export interface UserPreferences {
  selectedTopics: Category[];
  pushEnabled: boolean;
  breakingNewsAlerts: boolean;
  dailyDigest: boolean;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  fontSerif: boolean;
  edition: 'Global' | 'US' | 'Europe' | 'Asia';
}

export type DateFilterType = 'all' | 'today' | 'week' | 'month' | 'custom';

export interface FlashNewsItem {
  id: string;
  text: string;
  category?: Category | string;
  urgent?: boolean;
  active: boolean;
  articleId?: string;
  timestamp?: string;
}
