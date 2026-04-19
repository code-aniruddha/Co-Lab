import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

// Global animation variants for White Canvas Brutalism

export const variants = {
  fadeUp: {
    hidden: { y: 50, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  },
  clipReveal: {
    hidden: { y: "105%" },
    show: { y: "0%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }
  },
  slideInLeft: {
    hidden: { x: -80, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
  },
  slideInRight: {
    hidden: { x: 80, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
  },
  drawBorder: {
    hidden: { scaleX: 0, transformOrigin: "left" },
    show: { scaleX: 1, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }
  },
  fillBlock: {
    hidden: { scaleY: 0, transformOrigin: "top" },
    show: { scaleY: 1, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }
  },
  staggerContainer: {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } }
  },
  staggerFast: {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
  },
  pageEnter: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -16, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } }
  }
};

// Default viewport configuration for scroll animations
export const viewportConfig = { once: true, amount: 0.12 };
