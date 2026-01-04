# react-native-fabric-html-text

Fabric-first HTML text renderer for React Native with iOS, Android, and web support.

## Features

- Native Fabric component for optimal performance
- HTML parsing and rendering (bold, italic, lists, links)
- Link detection (URLs, emails, phone numbers)
- Custom tag styles via `tagStyles` prop
- XSS protection with built-in sanitization
- NativeWind/Tailwind CSS integration via `/nativewind` export

## Installation

```sh
npm install react-native-fabric-html-text
# or
yarn add react-native-fabric-html-text
```

### iOS

```sh
cd ios && pod install
```

## Usage

```tsx
import { HTMLText } from 'react-native-fabric-html-text';

export default function App() {
  return (
    <HTMLText
      html="<p>Hello <strong>world</strong></p>"
      style={{ fontSize: 16 }}
    />
  );
}
```

### With Links

```tsx
<HTMLText
  html='<p>Visit <a href="https://example.com">our site</a></p>'
  onLinkPress={(url, type) => {
    console.log(`Pressed ${type}: ${url}`);
  }}
/>
```

### With Custom Styles

```tsx
<HTMLText
  html="<p>Normal <strong>bold red</strong> and <em>italic blue</em></p>"
  tagStyles={{
    strong: { color: '#CC0000' },
    em: { color: '#0066CC' },
  }}
/>
```

### Auto-Detection

```tsx
<HTMLText
  html="<p>Call 555-123-4567 or email support@example.com</p>"
  detectPhoneNumbers
  detectEmails
  onLinkPress={(url, type) => {
    // type will be 'phone' or 'email'
  }}
/>
```

## NativeWind Integration

This library supports [NativeWind](https://www.nativewind.dev/) for Tailwind CSS styling in React Native.

> **Full setup guide**: See [docs/nativewind-setup.md](docs/nativewind-setup.md) for complete babel, metro, and tailwind configuration instructions.

### Installation

```sh
# Install NativeWind and Tailwind CSS (3.x required)
npm install nativewind
npm install -D tailwindcss@">=3.3.0 <4.0.0"
```

### Pre-configured Export (Recommended)

Import from the `/nativewind` subpath for zero-config Tailwind CSS support:

```tsx
import { HTMLText } from 'react-native-fabric-html-text/nativewind';

function MyComponent() {
  return (
    <HTMLText
      html="<p>Hello <strong>World</strong></p>"
      className="text-blue-500 text-lg font-medium p-4"
    />
  );
}
```

### Responsive Variants

```tsx
<HTMLText
  html="<p>Responsive text</p>"
  className="text-sm md:text-base lg:text-lg"
/>
```

### Dark Mode

```tsx
<HTMLText
  html="<p>Theme-aware text</p>"
  className="text-gray-900 dark:text-gray-100"
/>
```

### Manual Integration

For more control, apply `cssInterop` yourself:

```tsx
import { HTMLText } from 'react-native-fabric-html-text';
import { cssInterop } from 'nativewind';

// Apply once at app startup
cssInterop(HTMLText, { className: 'style' });

function MyComponent() {
  return (
    <HTMLText
      html="<p>Hello World</p>"
      className="text-blue-500"
    />
  );
}
```

### TypeScript Setup

Add NativeWind types to your project:

```typescript
// nativewind-env.d.ts
/// <reference types="nativewind/types" />
```

### Requirements

- NativeWind ^4.1.0
- Tailwind CSS 3.x

## Props

| Prop | Type | Description |
|------|------|-------------|
| `html` | `string` | HTML content to render |
| `style` | `TextStyle` | Style applied to the text |
| `className` | `string` | Tailwind CSS classes (requires `/nativewind` import) |
| `tagStyles` | `Record<string, TextStyle>` | Custom styles per HTML tag |
| `onLinkPress` | `(url: string, type: DetectedContentType) => void` | Callback when a link is pressed |
| `detectLinks` | `boolean` | Auto-detect URLs in text |
| `detectPhoneNumbers` | `boolean` | Auto-detect phone numbers |
| `detectEmails` | `boolean` | Auto-detect email addresses |
| `numberOfLines` | `number` | Limit text to specified number of lines with animated height transitions (0 = no limit) |
| `animationDuration` | `number` | Height animation duration in seconds (default: 0.2) |
| `includeFontPadding` | `boolean` | Android: include font padding |

## Requirements

- React Native >= 0.80 (New Architecture / Fabric)
- iOS >= 15.1
- Android API >= 21

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
