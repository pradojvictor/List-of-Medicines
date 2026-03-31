export function isElementScrollable(el, { vertical = true, horizontal = true } = {}) {
  if (!el || !(el instanceof HTMLElement)) return false;

  // SSR-safe: fallback quando window/getComputedStyle não existem
  if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
    return (vertical && el.scrollHeight > el.clientHeight) || (horizontal && el.scrollWidth > el.clientWidth);
  }

  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY;
  const overflowX = style.overflowX;

  const canScrollY =
    (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
    el.scrollHeight > el.clientHeight;

  const canScrollX =
    (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay') &&
    el.scrollWidth > el.clientWidth;

  return (vertical && canScrollY) || (horizontal && canScrollX);
}
