# ScrollArea Component

A reusable scrollable container with smart fade-out effect at the bottom to indicate more content.

## Features

- **Bounded Height**: Constrain content to a specific maximum height with `clamp()` support
- **Smart Fade**: Automatically shows/hides bottom fade effect based on scroll position
- **Minimal Scrollbars**: Uses global dark scrollbar styling
- **Cross-browser**: CSS mask support for Webkit browsers, fallback for others
- **Accessible**: Keyboard navigation and smooth scrolling preserved

## Props

```tsx
type TProps = {
  children: ReactNode
  className?: string
  maxHeight?: number | string    // Default: clamp(280px, 42vh, 580px)
  fadeSize?: number             // Default: 40px
  style?: CSSProperties
}
```

## Usage

```tsx
import { ScrollArea } from '@/components/ui/scroll-area/scroll-area'

function MyComponent() {
  return (
    <ScrollArea maxHeight="clamp(320px, 50vh, 650px)" fadeSize={48}>
      <div className="space-y-4 pr-2">
        {/* Long content that needs scrolling */}
        {items.map(item => <div key={item.id}>{item.name}</div>)}
      </div>
    </ScrollArea>
  )
}
```

## Implementation Notes

- The fade effect uses CSS `mask-image` for clean integration with any background
- Fade automatically disappears when scrolled to bottom
- No fade is shown if content fits within the container
- Padding-right (`pr-2`) recommended on content to account for scrollbar space
- Component tracks scroll position and content changes to update fade state

## Global Scrollbar Styling

Scrollbars are styled globally via `/src/styles/scrollbar.css`:

```css
:root {
  --sb-size: 8px;
  --sb-track: oklch(0.145 0 0);
  --sb-thumb: oklch(0.269 0 0);
  --sb-thumb-hover: oklch(0.35 0 0);
}
```

## Browser Support

- **Chrome/Edge**: Full CSS mask and scrollbar support
- **Firefox**: Uses `mask-image` and `scrollbar-color`  
- **Safari**: Uses `-webkit-mask-image` for fade effect
- **Accessibility**: Keyboard scrolling and reduced motion respected
