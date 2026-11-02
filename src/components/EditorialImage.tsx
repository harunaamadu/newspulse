import React from 'react';
import { LEAD_PORTRAIT_IMAGE } from '../utils/editorialImages';

interface EditorialImageProps {
  articleId: string;
  title: string;
  className?: string;
  alt?: string;
  category?: string;
}

// Exact coordinate bounding boxes (x, y, width, height) mapped from the uploaded 736x1570 broadsheet layout
const CROPS: Record<string, { x: number; y: number; w: number; h: number }> = {
  // Center Lead Portrait: The curly-haired woman
  'lead-story-1': { x: 168, y: 82, w: 400, h: 260 },

  // Left Hero Stacked
  'hero-left-1': { x: 28, y: 82, w: 120, h: 90 }, // Vaulted door / explorer
  'hero-left-2': { x: 28, y: 295, w: 120, h: 90 }, // Children outside house

  // Right Hero Half Post
  'hero-right-1': { x: 588, y: 82, w: 120, h: 100 }, // Nordic cabin by water

  // Business 5-Column Grid
  'biz-1': { x: 28, y: 555, w: 120, h: 95 }, // Dexter lab researcher
  'biz-2': { x: 168, y: 555, w: 120, h: 95 }, // Matchbox / Citrus branch
  'biz-3': { x: 308, y: 555, w: 120, h: 95 }, // Theatrical heights / Kayaks
  'biz-4': { x: 448, y: 555, w: 120, h: 95 }, // High school graduate portrait
  'biz-5': { x: 588, y: 555, w: 120, h: 95 }, // Rhoda Morgenstern berries

  // Politics Section
  'pol-lead-1': { x: 28, y: 822, w: 442, h: 290 }, // Curly-haired beard profile
  'pol-side-1': { x: 636, y: 825, w: 72, h: 54 }, // Senate budget stage
  'pol-side-2': { x: 636, y: 908, w: 72, h: 54 }, // New York transit crowd
  'pol-side-3': { x: 636, y: 998, w: 72, h: 54 }, // Vaulted door envoy
  'pol-side-4': { x: 636, y: 1100, w: 72, h: 54 }, // Capital chronicles porch

  // Travel Section 5-Column Gallery
  'trav-1': { x: 28, y: 1295, w: 120, h: 92 }, // Middle East Petra ruins
  'trav-2': { x: 168, y: 1295, w: 120, h: 92 }, // Karakoram alpine peak
  'trav-3': { x: 308, y: 1295, w: 120, h: 92 }, // Pakistan camels & desert
  'trav-4': { x: 448, y: 1295, w: 120, h: 92 }, // Amalfi coast boat fishermen
  'trav-5': { x: 588, y: 1295, w: 120, h: 92 }, // Lake Brienz wooden boat
};

export const EditorialImage: React.FC<EditorialImageProps> = ({
  articleId,
  title,
  className = 'w-full h-full object-cover',
  alt,
  category = 'world',
}) => {
  const crop = CROPS[articleId];

  if (crop) {
    return (
      <svg
        viewBox={`${crop.x} ${crop.y} ${crop.w} ${crop.h}`}
        preserveAspectRatio="xMidYMid slice"
        className={className}
        role="img"
        aria-label={alt || title}
      >
        <image
          href={LEAD_PORTRAIT_IMAGE}
          width="736"
          height="1570"
          preserveAspectRatio="none"
        />
      </svg>
    );
  }

  // Fallback to high-contrast monochrome pattern for any dynamic extra articles
  return (
    <div className={`flex items-center justify-center bg-stone-900 text-stone-100 p-4 ${className}`}>
      <div className="text-center">
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 block mb-1">
          {category}
        </span>
        <span className="font-editorial-headline text-sm font-bold line-clamp-2">
          {title}
        </span>
      </div>
    </div>
  );
};
