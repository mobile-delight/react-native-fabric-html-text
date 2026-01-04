/**
 * NativeWind-compatible exports with cssInterop pre-applied.
 *
 * @example
 * ```tsx
 * import { HTMLText } from 'react-native-fabric-html-text/nativewind';
 *
 * <HTMLText
 *   html="<p>Hello World</p>"
 *   className="text-blue-500 text-lg"
 * />
 * ```
 *
 * @requires nativewind ^4.1.0 as peer dependency
 */

import { cssInterop } from 'nativewind';
import {
  HTMLText as BaseHTMLText,
  FabricHTMLText as BaseFabricHTMLText,
} from './index';

// Apply cssInterop to map className → style
cssInterop(BaseHTMLText, { className: 'style' });
cssInterop(BaseFabricHTMLText, { className: 'style' });

// Re-export with cssInterop applied
export { BaseHTMLText as HTMLText, BaseFabricHTMLText as FabricHTMLText };

// Re-export types and utilities
export type { HTMLTextProps, DetectedContentType } from './index';
export { sanitize, ALLOWED_TAGS, ALLOWED_ATTR } from './index';
