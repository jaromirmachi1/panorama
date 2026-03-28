import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Mobile browsers fire resize when the URL bar shows/hides while scrolling; a full
// refresh() on every such event blocks the main thread and feels like scroll “sticking”.
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger }

