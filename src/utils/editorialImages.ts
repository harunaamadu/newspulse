/**
 * Curated editorial visual assets for NewsPulse
 * Includes the user-uploaded lead asset and crisp, high-contrast monochrome
 * & duotone editorial compositions that emulate the Times Writer broadsheet aesthetic.
 */

export const LEAD_PORTRAIT_IMAGE = '/public/assets/aistudio/9419439ed67a16412799c6fbc6a6af40_23eb9fb7.jpg';

// Helper to generate elegant editorial SVG canvas patterns for article categories
export function getEditorialAsset(id: string, category: string, title: string): string {
  // If it's the lead story, always return the uploaded image
  if (id === 'lead-story-1') {
    return LEAD_PORTRAIT_IMAGE;
  }

  // Curated SVG representations with rich film-grain textures, architectural linework, and duotone palettes
  const colorPalettes: Record<string, { bg: string; fg: string; accent: string; label: string }> = {
    politics: { bg: '#1c1917', fg: '#e7e5e4', accent: '#78716c', label: 'DIPLOMACY & CIVICS' },
    business: { bg: '#0f172a', fg: '#cbd5e1', accent: '#38bdf8', label: 'FINANCE & VENTURE' },
    tech: { bg: '#09090b', fg: '#e4e4e7', accent: '#a1a1aa', label: 'QUANTUM & ALGORITHMS' },
    world: { bg: '#292524', fg: '#f5f5f4', accent: '#d6d3d1', label: 'GLOBAL AFFAIRS' },
    travel: { bg: '#18181b', fg: '#fafafa', accent: '#fbbf24', label: 'EXPEDITIONS & PLACE' },
    culture: { bg: '#171717', fg: '#f5f5f5', accent: '#f43f5e', label: 'CRITIQUE & ARTS' },
    opinion: { bg: '#262626', fg: '#e5e5e5', accent: '#e2e8f0', label: 'ESSAYS & VOICES' },
  };

  const p = colorPalettes[category] || colorPalettes.world;
  const cleanTitle = title.replace(/["'<>&]/g, '').slice(0, 32);

  // SVG Data URI for an instant, offline-safe, high-res editorial image
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="grad_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${p.bg}" />
        <stop offset="100%" stop-color="#000000" />
      </linearGradient>
      <pattern id="grain_${id}" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="none" />
        <circle cx="20" cy="20" r="1" fill="#ffffff" opacity="0.08" />
        <circle cx="70" cy="50" r="1.5" fill="#ffffff" opacity="0.06" />
        <circle cx="40" cy="80" r="0.8" fill="#ffffff" opacity="0.07" />
        <line x1="0" y1="20" x2="100" y2="20" stroke="#ffffff" stroke-width="0.3" opacity="0.05" />
        <line x1="0" y1="60" x2="100" y2="60" stroke="#ffffff" stroke-width="0.3" opacity="0.05" />
      </pattern>
    </defs>
    <rect width="800" height="600" fill="url(#grad_${id})" />
    <rect width="800" height="600" fill="url(#grain_${id})" />
    
    <!-- Architectural / Editorial geometric framing -->
    <rect x="30" y="30" width="740" height="540" fill="none" stroke="${p.fg}" stroke-width="0.8" opacity="0.2" />
    <circle cx="400" cy="260" r="150" fill="none" stroke="${p.accent}" stroke-width="1.2" opacity="0.25" stroke-dasharray="4,6" />
    <circle cx="400" cy="260" r="90" fill="none" stroke="${p.fg}" stroke-width="0.7" opacity="0.3" />
    
    <!-- Editorial Typographic Stamp on Canvas -->
    <text x="400" y="240" font-family="Cinzel, Georgia, serif" font-size="14" font-weight="700" letter-spacing="4" fill="${p.accent}" text-anchor="middle" opacity="0.8">${p.label}</text>
    <text x="400" y="280" font-family="Playfair Display, Georgia, serif" font-size="22" font-style="italic" fill="${p.fg}" text-anchor="middle" opacity="0.95">${cleanTitle}</text>
    <text x="400" y="320" font-family="sans-serif" font-size="11" letter-spacing="2" fill="${p.fg}" text-anchor="middle" opacity="0.4">NEWSPULSE BROADSHEET ARCHIVE</text>
    
    <!-- Bottom caption bar -->
    <rect x="30" y="525" width="740" height="45" fill="#000000" opacity="0.6" />
    <text x="50" y="552" font-family="sans-serif" font-size="11" fill="${p.fg}" opacity="0.7">PLATE REF: NP-${id.toUpperCase()}</text>
    <text x="750" y="552" font-family="sans-serif" font-size="11" fill="${p.fg}" opacity="0.5" text-anchor="end">DOCUMENTARY DISPATCH</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
