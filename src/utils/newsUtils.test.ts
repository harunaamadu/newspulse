import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterArticlesBySearch,
  filterArticlesByPersonalizedFeed,
  toggleCommentUpvote,
  addCommentToThread,
  formatEditorialDate,
} from './newsUtils';
import { Article, Comment, UserPreferences } from '../types';

const mockSampleArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Global Summit on Artificial Intelligence Concludes in Geneva',
    excerpt: 'World leaders and leading researchers commit to transparency standards.',
    category: 'tech',
    author: { name: 'Elena Rostova', role: 'Technology Editor', avatar: '' },
    publishedAt: '2026-11-01T10:00:00Z',
    readTime: 6,
    imageUrl: '/public/assets/aistudio/9419439ed67a16412799c6fbc6a6af40_23eb9fb7.jpg',
    content: [{ type: 'paragraph', text: 'Geneva welcomed over forty delegations.' }],
    tags: ['AI', 'Policy', 'Geneva'],
    commentsCount: 14,
    upvotesCount: 85,
  },
  {
    id: 'art-2',
    title: 'Market Rally Follows Surprise Semiconductor Revenue Reports',
    excerpt: 'European bourses surge as next-generation chip architecture enters mass production.',
    category: 'business',
    author: { name: 'Julian Vance', role: 'Financial Correspondent', avatar: '' },
    publishedAt: '2026-10-25T08:00:00Z',
    readTime: 4,
    imageUrl: '',
    content: [{ type: 'paragraph', text: 'Trading floors in Frankfurt and London posted solid gains.' }],
    tags: ['Semiconductors', 'Markets', 'Economy'],
    commentsCount: 8,
    upvotesCount: 42,
  },
  {
    id: 'art-3',
    title: 'Diplomatic Accord on Maritime Boundaries Finalized',
    excerpt: 'Coastal nations ratify historic navigational freedom framework.',
    category: 'politics',
    author: { name: 'Amina Al-Mansoor', role: 'Diplomatic Bureau Chief', avatar: '' },
    publishedAt: '2026-10-15T12:00:00Z',
    readTime: 5,
    imageUrl: '',
    content: [{ type: 'paragraph', text: 'After three years of negotiation, the treaty is signed.' }],
    tags: ['Treaty', 'Maritime', 'Diplomacy'],
    commentsCount: 22,
    upvotesCount: 120,
  },
];

test('filterArticlesBySearch matches keyword in title, author or tags', () => {
  const result = filterArticlesBySearch(mockSampleArticles, { query: 'Geneva' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'art-1');

  const authorResult = filterArticlesBySearch(mockSampleArticles, { query: 'Julian Vance' });
  assert.equal(authorResult.length, 1);
  assert.equal(authorResult[0].id, 'art-2');
});

test('filterArticlesBySearch filters by category', () => {
  const result = filterArticlesBySearch(mockSampleArticles, { category: 'business' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'art-2');
});

test('filterArticlesBySearch filters by date range correctly', () => {
  const refDate = new Date('2026-11-02T12:00:00Z');
  // Article 1 is within week, Article 3 is older than 14 days
  const weekResult = filterArticlesBySearch(mockSampleArticles, {
    dateFilter: 'week',
    currentReferenceDate: refDate,
  });
  assert.equal(weekResult.length, 1);
  assert.equal(weekResult[0].id, 'art-1');

  // Month includes art-1, art-2, art-3
  const monthResult = filterArticlesBySearch(mockSampleArticles, {
    dateFilter: 'month',
    currentReferenceDate: refDate,
  });
  assert.equal(monthResult.length, 3);
});

test('filterArticlesByPersonalizedFeed ranks preferred categories first in for-you mode', () => {
  const prefs: UserPreferences = {
    selectedTopics: ['business'],
    pushEnabled: true,
    breakingNewsAlerts: true,
    dailyDigest: false,
    fontSize: 'base',
    fontSerif: true,
    edition: 'Global',
  };

  const ranked = filterArticlesByPersonalizedFeed(mockSampleArticles, prefs, 'for-you');
  assert.equal(ranked[0].category, 'business');
});

test('toggleCommentUpvote toggles upvote status and adjusts counter', () => {
  const comments: Comment[] = [
    {
      id: 'c1',
      articleId: 'art-1',
      authorName: 'Marcus',
      content: 'Essential reporting.',
      timestamp: '2h ago',
      upvotes: 5,
      userUpvoted: false,
    },
  ];

  const upvoted = toggleCommentUpvote(comments, 'c1');
  assert.equal(upvoted[0].upvotes, 6);
  assert.equal(upvoted[0].userUpvoted, true);

  const undone = toggleCommentUpvote(upvoted, 'c1');
  assert.equal(undone[0].upvotes, 5);
  assert.equal(undone[0].userUpvoted, false);
});

test('addCommentToThread adds a root comment and threaded reply', () => {
  let comments: Comment[] = [];
  comments = addCommentToThread(comments, 'art-1', {
    authorName: 'Sarah',
    content: 'Very insightful read.',
  });
  assert.equal(comments.length, 1);
  assert.equal(comments[0].authorName, 'Sarah');

  comments = addCommentToThread(comments, 'art-1', {
    authorName: 'David',
    content: 'I agree completely.',
    parentId: comments[0].id,
  });

  assert.equal(comments.length, 1);
  assert.equal(comments[0].replies?.length, 1);
  assert.equal(comments[0].replies?.[0].authorName, 'David');
});

test('formatEditorialDate formats date string nicely', () => {
  const formatted = formatEditorialDate('2026-11-02T00:00:00Z');
  assert.equal(formatted, 'November 02');
});
