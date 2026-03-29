/**
 * Blink vs WebKit: Safari (and iOS browsers) composite fixed layers and filters
 * differently; Chrome is fine with the same CSS.
 */

/** Chrome, Edge, Opera, Chrome on iOS — Blink-based. */
export function isChromiumBrowser(ua: string): boolean {
  return /Chrome|Chromium|Edg\/|OPR\/|Opera\/|CriOS/i.test(ua)
}

/** Safari / WebKit without Blink (macOS Safari, iOS Safari, embedded WKWebView, etc.). */
export function isWebKitWithoutBlink(ua: string): boolean {
  if (isChromiumBrowser(ua)) return false
  return /AppleWebKit/i.test(ua)
}

