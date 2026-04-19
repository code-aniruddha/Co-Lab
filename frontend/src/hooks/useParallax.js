import { useScroll, useTransform } from 'framer-motion';

export function useParallax(speed = 1) {
  const { scrollY } = useScroll();
  // Disable parallax on mobile by checking window width (or touch device)
  // But hooks must run unconditionally, so we set range dynamically
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const actualSpeed = isMobile ? 0 : speed;
  
  return useTransform(scrollY, [0, 1200], [0, actualSpeed * 360]);
}
