import type { BlogCoverTheme } from "@/lib/blog/cover-theme"

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/** 1200×675 SVG cover for blog cards and Open Graph. */
export function buildBlogCoverSvg(theme: BlogCoverTheme): string {
  const category = escapeXml(theme.category)
  const tagline = escapeXml(theme.tagline)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675" role="img" aria-label="${category}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.gradientFrom}"/>
      <stop offset="100%" stop-color="${theme.gradientTo}"/>
    </linearGradient>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <circle cx="150" cy="120" r="180" fill="${theme.accent}" opacity="0.12" filter="url(#blur)"/>
  <circle cx="1050" cy="580" r="220" fill="${theme.accent}" opacity="0.18" filter="url(#blur)"/>
  <g opacity="0.15" stroke="${theme.accent}" stroke-width="1.5" fill="none">
    <path d="M80 520 L320 380 L520 460 L720 300 L920 420 L1120 280"/>
    <circle cx="320" cy="380" r="6" fill="${theme.accent}"/>
    <circle cx="720" cy="300" r="6" fill="${theme.accent}"/>
    <circle cx="1120" cy="280" r="6" fill="${theme.accent}"/>
  </g>
  <text x="72" y="88" fill="#ffffff" font-family="system-ui,Segoe UI,sans-serif" font-size="28" font-weight="700" opacity="0.95">&lt;OfinIT/&gt;</text>
  <rect x="72" y="118" width="200" height="36" rx="18" fill="${theme.accent}" opacity="0.25"/>
  <text x="92" y="143" fill="#ffffff" font-family="system-ui,Segoe UI,sans-serif" font-size="16" font-weight="600">${category}</text>
  <text x="72" y="560" fill="#ffffff" font-family="system-ui,Segoe UI,sans-serif" font-size="42" font-weight="700">${tagline}</text>
</svg>`
}
