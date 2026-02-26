// ============================================================
//  src/components/Hero.jsx
//  3-D particle network + interactive orbit
// ============================================================
import { useRef, useMemo, useCallback, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Users, Globe, Zap, Network, Rocket } from 'lucide-react';
import * as THREE from 'three';

// â”€â”€â”€ Interactive Particle Network â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ParticleNetwork({ count = 2000 }) {
  const meshRef = useRef();
  const linesRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });
  const t = useRef(0);

  // Track mouse in 3-D space
  useThree(({ gl }) => {
    const canvas = gl.domElement;
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / canvas.offsetWidth  - 0.5) * 2;
      mouseRef.current.y = (e.clientY / canvas.offsetHeight - 0.5) * 2;
    };
    canvas.addEventListener('mousemove', onMove, { passive: true });
    return () => canvas.removeEventListener('mousemove', onMove);
  });

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 2.2 + Math.random() * 2.4;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const linePositions = useMemo(() => {
    const pts = [];
    const n = 140;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const ix = i * 3, jx = j * 3;
        const dx = positions[ix] - positions[jx];
        const dy = positions[ix+1] - positions[jx+1];
        const dz = positions[ix+2] - positions[jx+2];
        if (dx*dx + dy*dy + dz*dz < 2.8) {
          pts.push(positions[ix], positions[ix+1], positions[ix+2],
                   positions[jx], positions[jx+1], positions[jx+2]);
        }
      }
    }
    return new Float32Array(pts);
  }, [positions]);

  useFrame((_, delta) => {
    t.current += delta * 0.15;
    const mx = mouseRef.current.x * 0.35;
    const my = mouseRef.current.y * 0.25;
    if (meshRef.current) {
      meshRef.current.rotation.y = t.current * 0.38 + mx;
      meshRef.current.rotation.x = Math.sin(t.current * 0.28) * 0.22 - my;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t.current * 0.38 + mx;
      linesRef.current.rotation.x = Math.sin(t.current * 0.28) * 0.22 - my;
    }
  });

  return (
    <>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.11} linewidth={1} />
      </lineSegments>

      <Points ref={meshRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#7dd3fc" size={0.036} sizeAttenuation depthWrite={false} opacity={0.7} />
      </Points>

      <Points positions={positions.slice(0, 120)} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#818cf8" size={0.065} sizeAttenuation depthWrite={false} opacity={0.88} />
      </Points>
    </>
  );
}

// â”€â”€â”€ Torus rings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Rings() {
  const r1 = useRef(), r2 = useRef();
  useFrame((_, d) => {
    if (r1.current) { r1.current.rotation.z += d * 0.1; r1.current.rotation.x += d * 0.04; }
    if (r2.current) { r2.current.rotation.z -= d * 0.07; r2.current.rotation.y += d * 0.05; }
  });
  return (
    <>
      <mesh ref={r1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.8, 0.011, 16, 130]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.22} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 5, Math.PI / 6, 0]}>
        <torusGeometry args={[4.4, 0.007, 16, 130]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.14} />
      </mesh>
    </>
  );
}

// â”€â”€â”€ Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATS = [
  { value: '200+', label: 'Projects', icon: Network  },
  { value: '1.2k', label: 'Students', icon: Users    },
  { value: '48',   label: 'Colleges', icon: Globe    },
  { value: '94%',  label: 'Match Rate', icon: Zap    },
];

// â”€â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Hero({ onPostProject, onDiscover }) {
  const [hovered3D, setHovered3D] = useState(false);

  const scrollDown = useCallback(() => {
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a1628]">

      {/* 3-D canvas */}
      <div
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setHovered3D(true)}
        onMouseLeave={() => setHovered3D(false)}
      >
        <Canvas camera={{ position: [0, 0, 7.5], fov: 58 }} gl={{ antialias: true, alpha: true }}>
          <ambientLight intensity={0.6} />
          <ParticleNetwork />
          <Rings />
        </Canvas>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 0%, #0a1628 72%)',
      }} />

      {/* Content */}
      <div className="relative z-20 text-center px-5 sm:px-6 max-w-5xl mx-auto pt-28">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/25 bg-sky-500/8 text-sky-400 text-[11px] font-bold uppercase tracking-widest mb-7 animated-border"
        >
          <Sparkles size={11} className="pulse-glow" />
          Open Innovation Network
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6"
        >
          <span className="text-white">Where Great</span>
          <br />
          <span className="gradient-text text-glow-sky">Ideas Find</span>
          <br />
          <span className="text-white">Their Team.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Co-Lab connects visionary student builders with the talent they need.
          Post your idea, discover projects that match your skills, and ship
          something meaningful â€” together.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 35px rgba(56,189,248,0.55)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onPostProject}
            className="btn-primary px-9 py-4 text-base w-full sm:w-auto"
          >
            <Rocket size={16} /> Post Your Project
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, borderColor: 'rgba(56,189,248,0.6)' }}
            whileTap={{ scale: 0.96 }}
            onClick={onDiscover}
            className="btn-ghost px-9 py-4 text-base w-full sm:w-auto"
          >
            Explore Projects
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mb-20"
        >
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.88 + i * 0.1 }}
              whileHover={{ scale: 1.08 }}
              className="text-center cursor-default"
            >
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <Icon size={13} className="text-sky-400" />
                <span className="text-2xl font-extrabold text-white">{value}</span>
              </div>
              <p className="text-slate-500 text-[11px] uppercase tracking-widest">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollDown}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        whileHover={{ scale: 1.1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-slate-500 hover:text-sky-400 transition-colors group"
      >
        <span className="text-[10px] tracking-widest uppercase font-medium">Discover</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full border border-slate-700/70 flex items-center justify-center group-hover:border-sky-500/50 transition-colors"
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.button>
    </section>
  );
}
