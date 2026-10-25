const COLORS = ['#F5C842', '#C9A227', '#4ADE80', '#FB923C', '#F87171'];

// Generated once at module load, so rendering stays pure.
const PARTICLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: Math.random() * 8 + 4,
  delay: Math.random() * 1.5,
  color: COLORS[i % COLORS.length],
}));

/** Celebration overlay (mount it to play, unmount to stop). */
export default function ConfettiEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[70] overflow-hidden" aria-hidden="true">
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full animate-confetti"
          style={{
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
