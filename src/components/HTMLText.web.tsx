import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactElement,
} from 'react';
import type { HTMLTextProps } from './HTMLText';
import { sanitize } from '../core/sanitize.web';
import { convertStyle } from '../adapters/web/StyleConverter';

// Module-level flag to warn only once across all HTMLText instances
let hasWarnedAboutDetection = false;

// Unique ID counter for aria-describedby references
let uniqueIdCounter = 0;

/**
 * Web-specific implementation of HTMLText using semantic HTML elements.
 * Renders sanitized HTML using dangerouslySetInnerHTML for proper semantic output.
 *
 * Note: Wraps sanitized HTML in a div to apply className, style, and testID props.
 * This adds an extra wrapper element around the HTML content.
 *
 * Detection props (detectLinks, detectPhoneNumbers, detectEmails) are accepted
 * for API compatibility but have limited functionality on web. Browsers handle
 * URL detection natively, and phone/email detection is not supported.
 */
export default function HTMLText({
  html,
  style,
  className,
  testID,
  onLinkPress,
  detectLinks,
  detectPhoneNumbers,
  detectEmails,
  numberOfLines,
  writingDirection = 'auto',
}: HTMLTextProps): ReactElement | null {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate a unique instance ID for aria-describedby references
  const instanceId = useMemo(() => {
    uniqueIdCounter++;
    return `htmltext-${uniqueIdCounter}`;
  }, []);

  // Warn once in dev mode if detection props are used (limited functionality on web)
  useEffect(() => {
    if (
      !hasWarnedAboutDetection &&
      process.env.NODE_ENV !== 'production' &&
      (detectLinks || detectPhoneNumbers || detectEmails)
    ) {
      hasWarnedAboutDetection = true;
      console.warn(
        '[HTMLText] Detection props (detectLinks, detectPhoneNumbers, detectEmails) ' +
          'have limited functionality on web. Links work via native <a> tags. ' +
          'Phone and email detection are not supported on web.'
      );
    }
  }, [detectLinks, detectPhoneNumbers, detectEmails]);

  // Post-render DOM manipulation for accessibility and truncation
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const links = container.querySelectorAll('a');

    // Add position info to links for screen readers
    if (links.length > 0) {
      links.forEach((link, index) => {
        const descId = `${instanceId}-link-desc-${index + 1}`;

        // Add aria-describedby to link
        link.setAttribute('aria-describedby', descId);

        // Create hidden description element
        const descSpan = document.createElement('span');
        descSpan.id = descId;
        descSpan.style.cssText =
          'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
        descSpan.textContent = `Link ${index + 1} of ${links.length}`;

        // Append to container
        container.appendChild(descSpan);
      });
    }

    // Apply line-clamp styles for truncation via className
    if (numberOfLines && numberOfLines > 0) {
      const blockElements = container.querySelectorAll(
        'p, div, h1, h2, h3, h4, h5, h6, blockquote, li, ul, ol'
      );
      blockElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.display = '-webkit-box';
        htmlElement.style.webkitLineClamp = String(numberOfLines);
        htmlElement.style.webkitBoxOrient = 'vertical';
        htmlElement.style.overflow = 'hidden';
        htmlElement.style.margin = '0';
        htmlElement.style.padding = '0';
      });
    }

    // Cleanup function
    return () => {
      // Remove added description elements
      const descElements = container.querySelectorAll(
        `[id^="${instanceId}-link-desc-"]`
      );
      descElements.forEach((el) => el.remove());
    };
  }, [html, numberOfLines, instanceId]);

  // Handle link clicks if onLinkPress is provided
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (!onLinkPress) {
        return;
      }

      const target = event.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href) {
        event.preventDefault();
        onLinkPress(anchor.href, 'link');
      }
    },
    [onLinkPress]
  );

  if (!html) {
    return null;
  }

  const trimmedHtml = html.trim();
  if (!trimmedHtml) {
    return null;
  }

  // Sanitize HTML - this is the ONLY string manipulation we do
  // All post-processing (link annotations, truncation) happens via DOM APIs in useEffect
  const sanitizedHtml = sanitize(trimmedHtml);
  const cssStyle = convertStyle(style);

  // Count links for ARIA attributes
  const linkCount = (sanitizedHtml.match(/<a\s[^>]*href\s*=/gi) || []).length;

  // Apply CSS for truncation container
  const isTruncated = numberOfLines && numberOfLines > 0;
  const truncationStyle: React.CSSProperties = isTruncated
    ? { overflow: 'hidden', position: 'relative' as const }
    : { position: 'relative' as const };

  // Apply writing direction
  const directionStyle: React.CSSProperties =
    writingDirection === 'auto'
      ? {}
      : {
          direction: writingDirection,
          textAlign: 'start',
        };

  // Build ARIA attributes for screen reader navigation
  const ariaLabel =
    linkCount > 0
      ? `Contains ${linkCount} ${linkCount === 1 ? 'link' : 'links'}`
      : undefined;

  // Use role="group" when multiple links for semantic grouping
  const role = linkCount > 1 ? 'group' : undefined;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ...cssStyle, ...truncationStyle, ...directionStyle }}
      dir={writingDirection === 'auto' ? undefined : writingDirection}
      data-testid={testID}
      onClick={onLinkPress ? handleClick : undefined}
      tabIndex={0}
      aria-label={ariaLabel}
      role={role}
      // SAFETY: sanitizedHtml is sanitized via DOMPurify (sanitize() function imported from sanitize.web).
      // All post-processing (accessibility annotations, truncation styles) is performed via DOM APIs
      // in the useEffect hook above, not via string manipulation. This ensures XSS protection.
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
