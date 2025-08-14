export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function findFirstFocusable(root: HTMLElement): HTMLElement | null {
  const selector = [
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');
  return root.querySelector(selector) as HTMLElement | null;
}

export function focusSection(root: HTMLElement): void {
  const focusable = findFirstFocusable(root);
  if (focusable) {
    focusable.focus({ preventScroll: true });
    return;
  }
  if (!root.hasAttribute('tabindex')) root.setAttribute('tabindex', '-1');
  root.focus({ preventScroll: true });
}

export function scrollSectionIntoView(el: HTMLElement): void {
  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
  el.scrollIntoView({ behavior, block: 'start', inline: 'nearest' });
  focusSection(el);
}
