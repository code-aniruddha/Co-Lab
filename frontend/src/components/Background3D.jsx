// ============================================================
//  src/components/Background3D.jsx
//  Fixed full-viewport 3-D background — persists across all pages
//  Particle network + torus rings + animated grass blades field
// ============================================================
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ─── Mouse tracker (shared) ───────────────────────────────
const mouseRef = { x: 0, y: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    mouseRef.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseRef.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
}

// ─── Particle Network ─────────────────────────────────────
function ParticleNetwork({ count = 1800 }) {
  const meshRef  = useRef();
  const linesRef = useRef();
  const t = useRef(0);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 3.0 + Math.random() * 3.5;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const linePositions = useMemo(() => {
    const pts = [];
    const n = 120;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const ix = i * 3, jx = j * 3;
        const dx = positions[ix]   - positions[jx];
        const dy = positions[ix+1] - positions[jx+1];
        const dz = positions[ix+2] - positions[jx+2];
        if (dx*dx + dy*dy + dz*dz < 3.5) {
          pts.push(
            positions[ix], positions[ix+1], positions[ix+2],
            positions[jx], positions[jx+1], positions[jx+2]
          );
        }
      }
    }
    return new Float32Array(pts);
  }, [positions]);

  useFrame((_, delta) => {
    t.current += delta * 0.12;
    const mx = mouseRef.x * 0.22;
    const my = mouseRef.y * 0.16;
    if (meshRef.current) {
      meshRef.current.rotation.y = t.current * 0.28 + mx;
      meshRef.current.rotation.x = Math.sin(t.current * 0.21) * 0.18 - my;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = t.current * 0.28 + mx;
      linesRef.current.rotation.x = Math.sin(t.current * 0.21) * 0.18 - my;
    }
  });

  return (
    <>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.07} />
      </lineSegments>

      <Points ref={meshRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#7dd3fc" size={0.028} sizeAttenuation depthWrite={false} opacity={0.5} />
      </Points>

      <Points positions={positions.slice(0, 90)} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#818cf8" size={0.052} sizeAttenuation depthWrite={false} opacity={0.65} />
      </Points>
    </>
  );
}

// ─── Orbital Rings ────────────────────────────────────────
function Rings() {
  const r1 = useRef(), r2 = useRef(), r3 = useRef();
  useFrame((_, d) => {
    if (r1.current) { r1.current.rotation.z += d * 0.07;  r1.current.rotation.x += d * 0.03; }
    if (r2.current) { r2.current.rotation.z -= d * 0.05;  r2.current.rotation.y += d * 0.04; }
    if (r3.current) { r3.current.rotation.y += d * 0.06;  r3.current.rotation.z -= d * 0.025; }
  });
  return (
    <>
      <mesh ref={r1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[4.2, 0.009, 16, 140]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.14} />
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 5, Math.PI / 6, 0]}>
        <torusGeometry args={[5.1, 0.006, 16, 140]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.09} />
      </mesh>
      <mesh ref={r3} rotation={[Math.PI / 7, Math.PI / 4, Math.PI / 9]}>
        <torusGeometry args={[6.0, 0.005, 16, 140]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.07} />
      </mesh>
    </>
  );
}

// ─── Grass Blades Field ───────────────────────────────────
//  Each blade = 1 LineSegment from base to tip.
//  Tip sways with sine wave (phase offset per blade = wind effect).
function GrassField({ count = 1200 }) {
  const ref = useRef();
  const t   = useRef(0);

  // Pre-compute blade metadata once
  const bladeData = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x:      (Math.random() - 0.5) * 22,
      y:      (Math.random() - 0.5) * 14,
      z:      -2 - Math.random() * 6,
      height: 0.25 + Math.random() * 0.55,
      phase:  Math.random() * Math.PI * 2,
      freq:   0.6 + Math.random() * 0.8,
      amp:    0.08 + Math.random() * 0.18,
    }));
  }, [count]);

  // Initial geometry: every blade vertical at rest
  const initPositions = useMemo(() => {
    const pos = new Float32Array(count * 6); // 2 vertices * 3 floats
    bladeData.forEach(({ x, y, z, height }, i) => {
      const b = i * 6;
      pos[b]   = x;  pos[b+1] = y;          pos[b+2] = z;
      pos[b+3] = x;  pos[b+4] = y + height; pos[b+5] = z;
    });
    return pos;
  }, [bladeData, count]);

  useFrame((_, delta) => {
    t.current += delta * 0.45;
    const geom = ref.current?.geometry;
    if (!geom) return;
    const pos  = geom.attributes.position.array;

    // Wind also reacts to mouse
    const windX = mouseRef.x * 0.12;
    const windY = mouseRef.y * 0.05;

    bladeData.forEach(({ x, y, z, height, phase, freq, amp }, i) => {
      const b    = i * 6;
      const sway = Math.sin(t.current * freq + phase) * amp + windX;
      const lift = Math.cos(t.current * freq * 0.5 + phase) * amp * 0.3 + windY;

      // Base stays fixed
      pos[b]   = x;  pos[b+1] = y;               pos[b+2] = z;
      // Tip morphs
      pos[b+3] = x + sway;
      pos[b+4] = y + height + lift * 0.2;
      pos[b+5] = z + lift * 0.1;
    });

    geom.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initPositions, 3]}
          count={count * 2}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.09}
        vertexColors={false}
      />
    </lineSegments>
  );
}

// ─── Accent Grass (brighter, fewer) ───────────────────────
function AccentGrass({ count = 180 }) {
  const ref = useRef();
  const t   = useRef(0);

  const bladeData = useMemo(() =>
    Array.from({ length: count }, () => ({
      x:      (Math.random() - 0.5) * 20,
      y:      (Math.random() - 0.5) * 12,
      z:      -1 - Math.random() * 3,
      height: 0.45 + Math.random() * 0.9,
      phase:  Math.random() * Math.PI * 2,
      freq:   0.5 + Math.random() * 0.6,
      amp:    0.14 + Math.random() * 0.28,
      color:  Math.random() > 0.5 ? 0 : 1, // 0=sky, 1=indigo
    })), [count]);

  const initPositions = useMemo(() => {
    const pos = new Float32Array(count * 6);
    bladeData.forEach(({ x, y, z, height }, i) => {
      const b = i * 6;
      pos[b]   = x;  pos[b+1] = y;          pos[b+2] = z;
      pos[b+3] = x;  pos[b+4] = y + height; pos[b+5] = z;
    });
    return pos;
  }, [bladeData, count]);

  useFrame((_, delta) => {
    t.current += delta * 0.5;
    const geom = ref.current?.geometry;
    if (!geom) return;
    const pos  = geom.attributes.position.array;
    const windX = mouseRef.x * 0.18;

    bladeData.forEach(({ x, y, z, height, phase, freq, amp }, i) => {
      const b    = i * 6;
      const sway = Math.sin(t.current * freq + phase) * amp + windX;
      const wave = Math.cos(t.current * freq * 0.7 + phase + 1) * amp * 0.4;
      pos[b]   = x;  pos[b+1] = y;               pos[b+2] = z;
      pos[b+3] = x + sway;
      pos[b+4] = y + height + wave * 0.15;
      pos[b+5] = z;
    });
    geom.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initPositions, 3]}
          count={count * 2}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#c084fc" transparent opacity={0.13} />
    </lineSegments>
  );
}

// ─── Scene ────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <ParticleNetwork />
      <Rings />
      <GrassField   count={1200} />
      <AccentGrass  count={180}  />
    </>
  );
}

// ─── Background3D — root fixed canvas ─────────────────────
export default function Background3D() {
  return (
    <div
      aria-hidden="true"
      style={{
        position:  'fixed',
        inset:     0,
        zIndex:    0,
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, #080f1e 0%, #0a1628 55%, #0d1f3c 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 62 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
