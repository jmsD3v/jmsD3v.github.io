import type { Variants } from 'framer-motion'

export const fadeInFromLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const fadeInFromRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const fadeInFromTop: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const fadeInFromBottom: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

export const glitchReveal: Variants = {
  hidden: { opacity: 0, skewX: 10, scaleX: 1.05 },
  visible: {
    opacity: 1,
    skewX: 0,
    scaleX: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

/** Card that flips/bounces in from below — stack effect when staggered */
export const cardStack: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.94,
    rotateX: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 22,
      mass: 0.75,
    },
  },
}

/** Parent container for card stack — fast stagger so cards feel like a deck */
export const cardStackContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
}
