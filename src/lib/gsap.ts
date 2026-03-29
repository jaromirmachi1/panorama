import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Mobile browsers fire resize when the URL bar shows/hides while scrolling; a full
// refresh() on every such event blocks the main thread and feels like scroll “sticking”.
ScrollTrigger.config({
  ignoreMobileResize: true,
  limitCallbacks: true,
})

/**
 * One-shot ScrollTrigger preset. Prefer this over `scrub` for Lenis + Safari: scrub ties
 * animation progress to every scroll frame and multiplies ScrollTrigger work; trigger-based
 * reveals run once and stay on the GPU-friendly transform/opacity path.
 */
export function stOnce(
  trigger: gsap.DOMTarget,
  start = 'top 78%',
): { trigger: gsap.DOMTarget; start: string; once: true } {
  return { trigger, start, once: true }
}

export { gsap, ScrollTrigger }

