import DOMPurify from 'dompurify';

import { ALLOWED_TAGS, ALLOWED_ATTR } from './allowedHtml';
import { ALLOWED_PROTOCOLS } from './constants';

export { ALLOWED_TAGS, ALLOWED_ATTR };

// Build regex for allowed URI protocols
const protocolPattern = ALLOWED_PROTOCOLS.join('|');
const ALLOWED_URI_REGEXP = new RegExp(
  `^(?:(?:${protocolPattern}):|[^a-z]|[a-z+.\\-]+(?:[^a-z+.\\-:]|$))`,
  'i'
);

// Pre-compute DOMPurify options with protocol validation
const DOMPURIFY_OPTIONS = {
  ALLOWED_TAGS: [...ALLOWED_TAGS],
  ALLOWED_ATTR: [...ALLOWED_ATTR],
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  ALLOWED_URI_REGEXP,
};

// Pre-compute sanitize-html options (used server-side only)
const SANITIZE_HTML_OPTIONS = {
  allowedTags: [...ALLOWED_TAGS],
  allowedAttributes: {
    'a': ['href', 'target', 'rel'],
    'img': ['src', 'alt', 'width', 'height'],
    '*': ALLOWED_ATTR.filter(
      (attr) =>
        !['href', 'target', 'rel', 'src', 'alt', 'width', 'height'].includes(
          attr
        )
    ),
  },
  allowedSchemes: [...ALLOWED_PROTOCOLS],
  allowedSchemesByTag: {
    a: [...ALLOWED_PROTOCOLS],
    img: ['http', 'https', 'data'],
  },
  allowProtocolRelative: false,
  disallowedTagsMode: 'discard' as const,
};

// Lazy-load sanitize-html only on server (avoids bundling for client)
let sanitizeHtmlFn: ((html: string, options: object) => string) | null = null;

function getSanitizeHtml(): (html: string, options: object) => string {
  if (sanitizeHtmlFn === null) {
    // Dynamic require for server-side only (webpack aliases to false on client)
    // Using require() is intentional here for synchronous server-side loading
    sanitizeHtmlFn = require('sanitize-html') as (
      html: string,
      options: object
    ) => string;
  }
  return sanitizeHtmlFn;
}

/**
 * Sanitize HTML content for web environments.
 *
 * Uses environment-appropriate sanitizer:
 * - Browser: DOMPurify (peer dependency) - uses native DOM
 * - Server/SSR: sanitize-html (peer dependency) - Node.js native
 *
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitize(html: string | null | undefined): string {
  if (html === null || html === undefined || html === '') {
    return '';
  }

  if (typeof window !== 'undefined') {
    // Browser environment - use DOMPurify
    return DOMPurify.sanitize(html, DOMPURIFY_OPTIONS);
  } else {
    // Server environment - use sanitize-html
    const sanitizeHtml = getSanitizeHtml();
    return sanitizeHtml(html, SANITIZE_HTML_OPTIONS);
  }
}
