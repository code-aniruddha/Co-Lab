import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window) {
      setIsMobile(true);
      return;
    }

    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const mouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-hover')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', mouseOver);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', mouseOver);
    };
  }, []);

  const springX = useSpring(mousePosition.x, { stiffness: 600, damping: 30, mass: 0.5 });
  const springY = useSpring(mousePosition.y, { stiffness: 600, damping: 30, mass: 0.5 });
  
  const outerSpringX = useSpring(mousePosition.x, { stiffness: 80, damping: 20, mass: 0.5 });
  const outerSpringY = useSpring(mousePosition.y, { stiffness: 80, damping: 20, mass: 0.5 });

  useEffect(() => {
    springX.set(mousePosition.x);
    springY.set(mousePosition.y);
    outerSpringX.set(mousePosition.x - 18);
    outerSpringY.set(mousePosition.y - 18);
  }, [mousePosition, springX, springY, outerSpringX, outerSpringY]);

  if (isMobile) return null;

  return (
    <>
      {/* Outer Cursor */}
      <motion.div
        style={{
          x: outerSpringX,
          y: outerSpringY,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          border: '1px solid #ffffff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'difference',
          scale: isHovering ? 1.6 : 1,
          backgroundColor: isHovering ? '#ffffff' : 'transparent',
          borderColor: isHovering ? 'transparent' : '#ffffff'
        }}
        transition={{ scale: { type: "spring", stiffness: 300, damping: 20 }, backgroundColor: { duration: 0.2 } }}
      />
      {/* Inner Dot */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          position: 'fixed',
          top: '-3px',
          left: '-3px',
          width: '6px',
          height: '6px',
          backgroundColor: 'var(--section-accent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1
        }}
      />
    </>
  );
}
