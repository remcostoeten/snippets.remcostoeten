/**
 * Beautiful Code Block Component
 * 
 * A feature-rich, customizable code display component for React/Next.js applications
 * with syntax highlighting, search functionality, keyboard shortcuts, and custom badges.
 * 
 * Features:
 * • Syntax highlighting for 100+ languages
 * • Interactive search with Cmd/Ctrl+F
 * • Line highlighting and click callbacks
 * • Copy to clipboard with Cmd/Ctrl+C
 * • Collapsible code blocks with smooth animations
 * • Custom badge system with variants and auto-scroll
 * • Keyboard shortcuts and accessibility support
 * 
 * Installation:
 * 1. Install dependencies: framer-motion lucide-react react-syntax-highlighter clsx tailwind-merge @radix-ui/react-slot class-variance-authority
 * 2. Copy this file to your components directory
 * 3. Import and use: import { CodeBlock } from './beautiful-code-block'
 * 

 * @author Remco Stoeten
 * @name  Beautiful Code Block 
 * 
 * @description 
 * A feature-rich, performant, accessible code-block render component, which probably is the most beautiful you'll see.
 * 110+ languages, search highlight, programatic line highlighting, per-language icons, custom labels/themes, copy button, kbd-shortcuts
*/

'use client';

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  File,
  Search,
  X,
} from "lucide-react";
import { getLanguageIcon } from "./language-icons";
import { useCallback, useEffect, useRef, useState, useMemo, memo } from "react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { clsx, type ClassValue } from "clsx";
import type { CSSProperties } from "react";

// ============================================================================
// UTILITIES
// ============================================================================

// Simple className merger - replaces twMerge with basic deduplication
export const cn = (...inputs: ClassValue[]) => {
  const classes = clsx(inputs).split(' ');
  const merged = new Map<string, string>();

  // Simple deduplication for common conflicting classes
  for (const cls of classes) {
    if (!cls) continue;

    // Handle responsive variants and state variants
    const baseClass = cls.replace(/^(sm|md|lg|xl|2xl|hover|focus|active|disabled):/, '');
    const prefix = cls.match(/^(sm|md|lg|xl|2xl|hover|focus|active|disabled):/)?.[1] || '';
    const key = prefix ? `${prefix}:${baseClass.split('-')[0]}` : baseClass.split('-')[0];

    merged.set(key, cls);
  }

  return Array.from(merged.values()).join(' ');
};

const calculateCodeStats = (code: string) => {
  const lines = code.split("\n").length;
  const chars = code.length;
  const words = code.trim().split(/\s+/).length;
  return { lines, chars, words };
};

// Detect light/dark mode based on Tailwind's `dark` class or system preference
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const update = () => {
      setIsDark(root.classList.contains('dark') || media.matches);
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    media.addEventListener('change', update);

    return () => {
      observer.disconnect();
      media.removeEventListener('change', update);
    };
  }, []);

  return isDark;
}

// ============================================================================
// OPTIMIZED THEME CONFIGURATION
// ============================================================================

type TCustomTheme = { [key: string]: CSSProperties };

// Dark theme (existing)
const customTheme: TCustomTheme = {
  'code[class*="language-"]': {
    color: "#f1f5f9",
    background: "none",
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.5",
    fontSize: "14px",
    tabSize: 2,
    hyphens: "none",
  },
  'pre[class*="language-"]': {
    color: "#f1f5f9",
    background: "none",
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.5",
    fontSize: "14px",
    tabSize: 2,
    hyphens: "none",
    padding: "1em",
    margin: "0.5em 0",
    overflow: "auto",
  },
  // Simplified color scheme - merged similar elements
  comment: { color: "#636e7b", fontStyle: "italic" },
  "block-comment": { color: "#636e7b", fontStyle: "italic" },
  prolog: { color: "#636e7b" },
  doctype: { color: "#636e7b" },
  cdata: { color: "#636e7b" },
  punctuation: { color: "#94a3b8" },
  operator: { color: "#94a3b8" },
  url: { color: "#94a3b8" },
  // Pink/magenta elements
  tag: { color: "#f472b6" },
  "attr-name": { color: "#f472b6" },
  namespace: { color: "#f472b6" },
  property: { color: "#f472b6" },
  symbol: { color: "#f472b6" },
  important: { color: "#f472b6", fontWeight: "bold" },
  atrule: { color: "#f472b6" },
  keyword: { color: "#f472b6" },
  regex: { color: "#f472b6" },
  entity: { color: "#f472b6", cursor: "help" },
  // Blue elements
  "function-name": { color: "#60a5fa" },
  function: { color: "#60a5fa" },
  "class-name": { color: "#93c5fd" },
  builtin: { color: "#93c5fd" },
  // Purple elements
  boolean: { color: "#c084fc" },
  number: { color: "#c084fc" },
  constant: { color: "#c084fc" },
  // String elements
  string: { color: "#a5b4fc" },
  char: { color: "#a5b4fc" },
  "attr-value": { color: "#a5b4fc" },
  selector: { color: "#a5b4fc" },
  // Other
  deleted: { color: "#ef4444" },
  inserted: { color: "#34d399" },
  variable: { color: "#f1f5f9" },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
};

// Light theme
const customThemeLight: TCustomTheme = {
  'code[class*="language-"]': {
    color: "#0f172a",
    background: "none",
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.6",
    fontSize: "14px",
    tabSize: 2,
    hyphens: "none",
  },
  'pre[class*="language-"]': {
    color: "#0f172a",
    background: "none",
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.6",
    fontSize: "14px",
    tabSize: 2,
    hyphens: "none",
    padding: "1em",
    margin: "0.5em 0",
    overflow: "auto",
  },
  comment: { color: "#64748b", fontStyle: "italic" },
  "block-comment": { color: "#64748b", fontStyle: "italic" },
  prolog: { color: "#64748b" },
  doctype: { color: "#64748b" },
  cdata: { color: "#64748b" },
  punctuation: { color: "#475569" },
  operator: { color: "#475569" },
  url: { color: "#475569" },
  tag: { color: "#c026d3" },
  "attr-name": { color: "#c026d3" },
  namespace: { color: "#c026d3" },
  property: { color: "#c026d3" },
  symbol: { color: "#c026d3" },
  important: { color: "#7c3aed", fontWeight: "bold" },
  atrule: { color: "#7c3aed" },
  keyword: { color: "#7c3aed" },
  regex: { color: "#7c3aed" },
  entity: { color: "#7c3aed", cursor: "help" },
  "function-name": { color: "#2563eb" },
  function: { color: "#2563eb" },
  "class-name": { color: "#1d4ed8" },
  builtin: { color: "#1d4ed8" },
  boolean: { color: "#9333ea" },
  number: { color: "#9333ea" },
  constant: { color: "#9333ea" },
  string: { color: "#16a34a" },
  char: { color: "#16a34a" },
  "attr-value": { color: "#16a34a" },
  selector: { color: "#16a34a" },
  deleted: { color: "#dc2626" },
  inserted: { color: "#059669" },
  variable: { color: "#0f172a" },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
};

// ============================================================================
// OPTIMIZED LANGUAGE ICONS
// ============================================================================

type TIconProps = {
  className?: string;
  size?: number;
};

const DEFAULT_ICON_SIZE = 16;

// Beautiful icon component for languages using react-icons
function SimpleIcon({
  language,
  className = "",
  size = DEFAULT_ICON_SIZE
}: TIconProps & { language: string }) {
  const IconComponent = getLanguageIcon(language);

  return (
    <IconComponent
      size={size}
      className={cn("flex-shrink-0", className)}
    />
  );
}

// ============================================================================
// OPTIMIZED ANIMATIONS
// ============================================================================

const ANIMATIONS = {
  collapse: {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
      },
    },
  },
  copy: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
  },
  toast: {
    hidden: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  },
} as const;

// ============================================================================
// SIMPLIFIED BUTTON COMPONENT
// ============================================================================

type TButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type TButtonSize = "default" | "sm" | "lg" | "icon";

interface TButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TButtonVariant;
  size?: TButtonSize;
}

// Simple button class generator - replaces CVA
const getButtonClasses = (variant: TButtonVariant = "default", size: TButtonSize = "default") => {
  const base = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

  const variants = {
    default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
    outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  };

  return cn(base, variants[variant], sizes[size]);
};

const Button = memo(function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: TButtonProps) {
  return (
    <button
      className={cn(getButtonClasses(variant, size), className)}
      {...props}
    />
  );
});

// ============================================================================
// TYPES
// ============================================================================

export type TBadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | "custom";

export type TBadge = {
  text: string;
  variant: TBadgeVariant;
  customClass?: string;
};



export type TCodeBlockProps = {
  /** The source code to display */
  code: string;
  /** Programming language for syntax highlighting */
  language: string;
  /** Optional file name to display in header */
  fileName?: string;
  /** Array of badges to display in header */
  badges?: TBadge[];
  /** Whether to show line numbers (default: true) */
  showLineNumbers?: boolean;
  /** Enable interactive line highlighting (default: false) */
  enableLineHighlight?: boolean;
  /** Enable hover highlighting for lines (default: false) */
  enableLineHover?: boolean;
  /** Custom color for hover highlighting (default: 'rgba(255, 255, 255, 0.1)' for dark, 'rgba(0, 0, 0, 0.05)' for light) */
  hoverHighlightColor?: string;
  /** Show metadata like line count in header (default: true) */
  showMetaInfo?: boolean;
  /** Maximum height before scrolling (default: "400px") */
  maxHeight?: string;
  /** Additional CSS classes */
  className?: string;
  /** Callback when code is copied */
  onCopy?: (code: string) => void;
  /** Callback when a line is clicked (requires enableLineHighlight) */
  onLineClick?: (lineNumber: number) => void;
  /** Callback when search is performed */
  onSearch?: (query: string, results: number[]) => void;
  /** Default badge variant for all badges */
  badgeVariant?: TBadgeVariant;
  /** Custom color for badges when variant is "custom" */
  badgeColor?: string;
  /** Custom color for file name label */
  fileNameColor?: string;
  /** Initial search query */
  initialSearchQuery?: string;
  /** Initial search results (line numbers) */
  initialSearchResults?: number[];
  /** Initial highlighted lines */
  initialHighlightedLines?: number[];
  /** Auto-scroll speed for badges (pixels per second, default: 20) */
  autoScrollSpeed?: number;
  /** Enable auto-scroll for badges (default: true) */
  enableAutoScroll?: boolean;
  /** Whether to show the language icon in header (default: false) */
  showIcon?: boolean;
  /** Show bottom fade effect (default: true) */
  showBottomFade?: boolean;
  /** Custom width */
  width?: string;
  /** Custom height */
  height?: string;
};

// ============================================================================
// OPTIMIZED BADGE UTILITIES
// ============================================================================

type TBadgeProps = {
  variant?: TBadgeVariant;
  customColor?: string;
  customClass?: string;
};

const getBadgeClasses = ({ variant = "default", customClass }: TBadgeProps): string => {
  const base = "px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 shrink-0 whitespace-nowrap shadow-sm"; // Enhanced padding and added whitespace-nowrap and shadow

  if (variant === "custom") {
    return customClass
      ? cn(base, customClass)
      : cn(base, "bg-gradient-to-r from-pink-500 to-purple-500 text-white border border-pink-500/30 hover:shadow-md");
  }

  const variants = {
    primary: "border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:border-blue-400 hover:text-blue-300 hover:shadow-md",
    secondary: "border border-emerald-400/50 bg-emerald-500/5 text-emerald-300 hover:border-emerald-300 hover:bg-emerald-500/10 hover:shadow-emerald-500/20 hover:shadow-lg",
    success: "border border-orange-500/30 bg-orange-500/10 text-orange-400 hover:border-orange-400 hover:text-orange-300 hover:shadow-md",
    warning: "border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-md",
    danger: "border border-red-500/30 bg-red-500/10 text-red-400 hover:border-red-400 hover:text-red-300 hover:shadow-md",
    default: "border border-[#333333] bg-[#111111] text-zinc-400 hover:border-[#444444] hover:text-zinc-300 hover:shadow-md",
  };
  return cn(base, variants[variant]);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Beautiful Code Block Component - Ultra Optimized for Size with Auto-Scroll Badges
 *
 * A comprehensive code display component with syntax highlighting, search,
 * line highlighting, copy functionality, and custom badges with auto-scroll.
 *
 * @example
 * <CodeBlock
 *   code="const hello = 'world';"
 *   language="javascript"
 *   fileName="example.js"
 *   badges={[{ text: 'JS', variant: 'primary' }]}
 *   showLineNumbers
 *   enableLineHighlight
 *   enableAutoScroll
 * />
 */
export function CodeBlock({
  code,
  language,
  fileName,
  badges = [],
  showLineNumbers = true,
  enableLineHighlight = false,
  enableLineHover = false,
  hoverHighlightColor,
  showMetaInfo = true,
  maxHeight = "400px",
  className,
  onCopy,
  onLineClick,
  onSearch,
  badgeVariant = "default",
  badgeColor,
  fileNameColor,
  initialSearchQuery = "",
  initialSearchResults = [],
  initialHighlightedLines = [],
  autoScrollSpeed = 20,
  enableAutoScroll = true,
  showIcon = false,
  showBottomFade = true,
  width,
  height,
}: TCodeBlockProps) {
// State management
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSearching, setIsSearching] = useState(!!initialSearchQuery);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [searchResults, setSearchResults] = useState<number[]>(initialSearchResults);
  const [currentResultIndex, setCurrentResultIndex] = useState(initialSearchResults.length > 0 ? 0 : -1);
  const [highlightedLines, setHighlightedLines] = useState<number[]>(initialHighlightedLines);
  const [scrollPosition, setScrollPosition] = useState<'start' | 'middle' | 'end'>('start');
  const [isAutoScrolling, setIsAutoScrolling] = useState(enableAutoScroll);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  // Theme detection
  const isDark = useIsDarkMode();

  // Refs
  const codeRef = useRef<HTMLDivElement>(null);
  const badgeScrollRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Memoized values
  const stats = useMemo(() => calculateCodeStats(code), [code]);

  // Generate line background color based on state priority: clicked > search > hover
  const getLineBackgroundColor = useCallback((lineNumber: number): string => {
    // Priority 1: Click-highlighted lines (highest priority)
    if (highlightedLines.includes(lineNumber)) {
      return isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
    }
    
    // Priority 2: Search results (medium priority)
    if (searchResults.includes(lineNumber)) {
      return isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.1)";
    }
    
    // Priority 3: Hover state (lowest priority)
    if (enableLineHover && hoveredLine === lineNumber) {
      return hoverHighlightColor || (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.03)");
    }
    
    return "transparent";
  }, [highlightedLines, searchResults, hoveredLine, enableLineHover, hoverHighlightColor, isDark]);

  // Hover handlers
  const handleLineMouseEnter = useCallback((lineNumber: number) => {
    if (enableLineHover) {
      setHoveredLine(lineNumber);
    }
  }, [enableLineHover]);

  const handleLineMouseLeave = useCallback(() => {
    if (enableLineHover) {
      setHoveredLine(null);
    }
  }, [enableLineHover]);

  // Auto-scroll functionality for badges
  useEffect(() => {
    const element = badgeScrollRef.current;
    if (!element || !isAutoScrolling || badges.length === 0) return;

    let animationId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Calculate scroll position based on time
      const scrollAmount = (elapsed * autoScrollSpeed) / 1000;

      // Check if we've reached the end, reset to beginning for infinite scroll
      if (element.scrollLeft >= element.scrollWidth - element.clientWidth) {
        element.scrollLeft = 0;
        startTime = timestamp; // Reset timer
      } else {
        element.scrollLeft = scrollAmount % (element.scrollWidth - element.clientWidth);
      }

      animationId = requestAnimationFrame(animate);
    };

    // Only start auto-scroll if content overflows
    if (element.scrollWidth > element.clientWidth) {
      animationId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [badges, isAutoScrolling, autoScrollSpeed]);

  // Scroll to specific line
  const scrollToLine = useCallback((lineNumber: number) => {
    const lineElement = codeRef.current?.querySelector(`[data-line-number="${lineNumber}"]`);
    lineElement?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  // Search handler with debouncing via useEffect
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query) {
        setSearchResults([]);
        setCurrentResultIndex(-1);
        setHighlightedLines([]);
        onSearch?.("", []);
        return;
      }

      const lines = code.split("\n");
      const matches = lines.reduce((acc, line, index) => {
        if (line.toLowerCase().includes(query.toLowerCase())) {
          acc.push(index + 1);
        }
        return acc;
      }, [] as number[]);

      setSearchResults(matches);
      setCurrentResultIndex(matches.length > 0 ? 0 : -1);
      setHighlightedLines(matches);
      onSearch?.(query, matches);

      if (matches.length > 0) {
        scrollToLine(matches[0]);
      }
    },
    [code, onSearch, scrollToLine],
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => handleSearch(searchQuery), 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopy?.(code);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [code, onCopy]);

  // Search navigation
  const goToNextResult = useCallback(() => {
    if (searchResults.length === 0) return;
    const nextIndex = (currentResultIndex + 1) % searchResults.length;
    setCurrentResultIndex(nextIndex);
    scrollToLine(searchResults[nextIndex]);
  }, [searchResults, currentResultIndex, scrollToLine]);

  const goToPreviousResult = useCallback(() => {
    if (searchResults.length === 0) return;
    const prevIndex = currentResultIndex - 1 < 0 ? searchResults.length - 1 : currentResultIndex - 1;
    setCurrentResultIndex(prevIndex);
    scrollToLine(searchResults[prevIndex]);
  }, [searchResults, currentResultIndex, scrollToLine]);

  // Line click handler
  const handleLineClick = useCallback(
    (lineNumber: number) => {
      if (enableLineHighlight) {
        setHighlightedLines((prev) =>
          prev.includes(lineNumber)
            ? prev.filter((line) => line !== lineNumber)
            : [...prev, lineNumber],
        );
        onLineClick?.(lineNumber);
      }
    },
    [enableLineHighlight, onLineClick],
  );

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyboard(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "c") {
        copyToClipboard();
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "f" && !isCollapsed) {
        e.preventDefault();
        setIsSearching(true);
      }

      if (isSearching && searchResults.length > 0) {
        if (e.key === "Enter") {
          if (e.shiftKey) {
            goToPreviousResult();
          } else {
            goToNextResult();
          }
        }
      }

      if (e.key === "Escape") {
        setHighlightedLines([]);
        setIsSearching(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    }

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [
    isCollapsed,
    isSearching,
    searchResults,
    currentResultIndex,
    copyToClipboard,
    goToNextResult,
    goToPreviousResult,
  ]);

  // Drag-to-scroll functionality for badges
  useEffect(() => {
    const slider = badgeScrollRef.current;
    if (!slider) return;

    const mouseDownHandler = (e: MouseEvent) => {
      if (e.button !== 0) return; // Only left mouse button
      setIsDragging(true);
      setIsAutoScrolling(false); // Stop auto-scroll when dragging
      startX.current = e.pageX - slider.offsetLeft;
      scrollLeft.current = slider.scrollLeft;
      slider.style.cursor = 'grabbing';
      slider.style.userSelect = 'none';
    };

    const mouseLeaveUpHandler = () => {
      setIsDragging(false);
      slider.style.cursor = 'grab';
      slider.style.removeProperty('user-select');
      // Resume auto-scroll after a delay
      setTimeout(() => setIsAutoScrolling(enableAutoScroll), 2000);
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX.current) * 1.5; // Multiplier for faster scroll
      slider.scrollLeft = scrollLeft.current - walk;
    };

    slider.addEventListener('mousedown', mouseDownHandler);
    slider.addEventListener('mouseleave', mouseLeaveUpHandler);
    slider.addEventListener('mouseup', mouseLeaveUpHandler);
    slider.addEventListener('mousemove', mouseMoveHandler);

    return () => {
      slider.removeEventListener('mousedown', mouseDownHandler);
      slider.removeEventListener('mouseleave', mouseLeaveUpHandler);
      slider.removeEventListener('mouseup', mouseLeaveUpHandler);
      slider.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, [isDragging, enableAutoScroll]);

  // Update scroll position for fade indicators
  useEffect(() => {
    const element = badgeScrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollWidth, scrollLeft, clientWidth } = element;
      const isAtStart = scrollLeft === 0;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1; // -1 for precision
      if (isAtStart) {
        setScrollPosition('start');
      } else if (isAtEnd) {
        setScrollPosition('end');
      } else {
        setScrollPosition('middle');
      }
    };

    handleScroll(); // Initial check
    element.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Recalculate on resize
    return () => {
      element.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [badges]); // Re-run if badges change

  // Search UI component
  function renderSearchUI() {
    if (!isSearching) return null;

    return (
      <div
        className="flex items-center gap-2 bg-white dark:bg-[#111111] rounded-lg border border-zinc-200 dark:border-[#333333] p-1 h-8"
        role="search"
        aria-label="Code search"
      >
        <div className="relative">
          <label htmlFor="code-search-input" className="sr-only">
            Search within code block
          </label>
          <input
            id="code-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-40 px-2 py-1 text-sm bg-transparent text-zinc-800 dark:text-zinc-300 focus:outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            autoFocus
            aria-describedby={searchResults.length > 0 ? "search-results-status" : undefined}
          />
          {searchQuery && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
              {searchResults.length > 0 ? (
                <span>{currentResultIndex + 1}/{searchResults.length}</span>
              ) : (
                <span>No results</span>
              )}
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <>
            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-[#333333]" />
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPreviousResult}
                className="h-6 w-6 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              >
                <ArrowUp size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextResult}
                className="h-6 w-6 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
              >
                <ArrowDown size={14} />
              </Button>
            </div>
          </>
        )}

        <div className="h-4 w-[1px] bg-zinc-200 dark:bg-[#333333]" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setIsSearching(false);
            setSearchQuery("");
            setSearchResults([]);
            setHighlightedLines([]);
          }}
          className="h-6 w-6 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
        >
          <X size={14} />
        </Button>
      </div>
    );
  }



  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      <div
        className="group relative rounded-xl overflow-hidden bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-[#333333] w-full transition-all duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <header className="flex justify-between items-center px-4 py-2.5 bg-white dark:bg-[#0A0A0A] border-b border-zinc-200 dark:border-[#333333]">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {showIcon && (
             <span className="flex items-center justify-center shrink-0 text-zinc-600 dark:text-zinc-500 transition-colors duration-200 group-hover:text-zinc-800 dark:group-hover:text-zinc-400">
              <SimpleIcon language={language} />
            </span>
            )}
            {fileName && (
              <div
                className={cn(
                  "shrink-0 flex items-center gap-2 rounded-full px-3 py-1 border transition-all duration-200",
                  fileNameColor
                    ? `border-${fileNameColor}-500/30 bg-${fileNameColor}-500/10 text-${fileNameColor}-600 dark:text-${fileNameColor}-400 group-hover:border-${fileNameColor}-400 group-hover:text-${fileNameColor}-700 dark:group-hover:text-${fileNameColor}-300`
                    : "bg-zinc-50 dark:bg-[#111111] border-zinc-200 dark:border-[#333333] group-hover:border-zinc-300 dark:group-hover:border-[#444444]",
                )}
              >
                <File
                  size={12}
                  className={fileNameColor ? `text-${fileNameColor}-600 dark:text-${fileNameColor}-400` : "text-zinc-500 dark:text-zinc-400"}
                />
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-200",
                    fileNameColor
                      ? `text-${fileNameColor}-700 dark:text-${fileNameColor}-400 group-hover:text-${fileNameColor}-800 dark:group-hover:text-${fileNameColor}-300`
                      : "text-zinc-700 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300",
                  )}
                >
                  {fileName}
                </span>
              </div>
            )}

            {/* Enhanced Badges container with auto-scroll */}
            {badges.length > 0 && (
              <div className="relative flex-grow min-w-0 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <div
                  ref={badgeScrollRef}
                  className={cn(
                    "relative flex flex-row items-center gap-3 overflow-x-auto whitespace-nowrap scroll-smooth",
                    "transition-all duration-300 ease-in-out",
                    "py-1 px-1", // More padding for badges
                    // Auto-scroll styling
                    isAutoScrolling ? "cursor-default" : "cursor-grab active:cursor-grabbing",
                  )}
                  style={{
                    scrollbarWidth: 'none',
                    WebkitOverflowScrolling: 'touch',
                    msOverflowStyle: 'none',
                  }}
                  role="region"
                  aria-label="Code badges"
                  onMouseEnter={() => setIsAutoScrolling(false)} // Pause auto-scroll on hover
                  onMouseLeave={() => setTimeout(() => setIsAutoScrolling(enableAutoScroll), 1000)} // Resume after delay
                >
                  {badges.map((badge, index) => (
                    <span
                      key={index}
                      className={cn(
                        getBadgeClasses({
                          variant: badge.variant || badgeVariant,
                          customColor: badgeColor,
                          customClass: badge.customClass,
                        }),
                        "animate-in slide-in-from-right-2 duration-300", // Smooth entry animation
                        "min-w-fit", // Ensure badges don't compress
                      )}
                      style={{
                        animationDelay: `${index * 100}ms`, // Stagger the entry animations
                      }}
                    >
                      {badge.text}
                    </span>
                  ))}
                </div>

                {/* Enhanced fade edges */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/80 dark:to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/80 dark:to-transparent z-10" />

                {/* Auto-scroll indicator */}
                {isAutoScrolling && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-0.5 bg-blue-400/50 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            )}

            {showMetaInfo && (
              <span className="shrink-0 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-500">
                {stats.lines} lines • {stats.words} words
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1.5 h-8">
            {renderSearchUI()}

            {!isSearching && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearching(true)}
                className="relative h-8 w-8 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 rounded-md transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10"
                title="Search (⌘/Ctrl + F)"
              >
                <Search size={16} />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="relative h-8 w-8 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 rounded-md transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isCollapsed ? 0 : 180 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <ChevronDown size={16} />
              </motion.div>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="relative h-8 w-8 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 rounded-md transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10"
              title="Copy code (⌘/Ctrl + C)"
            >
              <AnimatePresence mode="wait">
                {isCopied ? (
                  <motion.div
                    key="check"
                    variants={ANIMATIONS.copy}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="text-emerald-600 dark:text-emerald-400"
                  >
                    <Check size={16} />
                  </motion.div>
                ) : (
                  <Copy size={16} />
                )}
              </AnimatePresence>
            </Button>
          </div>
        </header>

        {/* Code Content */}
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={ANIMATIONS.collapse}
              className="overflow-hidden"
            >
              <div className="relative" ref={codeRef}>
                {showLineNumbers && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3.5rem] bg-gradient-to-r from-white via-white/50 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/50 dark:to-transparent pointer-events-none z-10" />
                )}

                <div className="relative">
                  <div className="p-4 overflow-y-auto" style={{ maxHeight }}>
                    <SyntaxHighlighter
                      language={language.toLowerCase()}
                      style={isDark ? customTheme : customThemeLight}
                      customStyle={{
                        margin: 0,
                        padding: 0,
                        background: "transparent",
                        fontSize: "0.875rem",
                      }}
                      showLineNumbers={showLineNumbers}
                      lineNumberStyle={{
                        color: isDark ? "#666666" : "#94a3b8",
                        minWidth: "2.5em",
                        paddingRight: "1em",
                        textAlign: "right",
                        userSelect: "none",
                        opacity: isHovered ? 1 : 0.5,
                        transition: "opacity 0.2s ease",
                      }}
                      wrapLines={true}
                      wrapLongLines={true}
                      lineProps={(lineNumber) => ({
                        style: {
                          display: "block",
                          cursor: enableLineHighlight || enableLineHover ? "pointer" : "default",
                          backgroundColor: getLineBackgroundColor(lineNumber),
                          transition: "background-color 0.16s ease",
                        },
                        onClick: () => handleLineClick(lineNumber),
                        onMouseEnter: () => handleLineMouseEnter(lineNumber),
                        onMouseLeave: handleLineMouseLeave,
                      })}
                    >
                      {code}
                    </SyntaxHighlighter>
                  </div>
                  {showBottomFade && (
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#0A0A0A] dark:via-[#0A0A0A]/80 dark:to-transparent pointer-events-none" />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Copy Toast */}
      <AnimatePresence>
        {isCopied && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={ANIMATIONS.toast}
            className="absolute top-3 right-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#1A1A1A] border border-zinc-200 dark:border-[#333333] shadow-lg"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Copied to clipboard</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export { Button, getBadgeClasses, customTheme };
export { customThemeLight };
export type { TButtonProps, TIconProps };
