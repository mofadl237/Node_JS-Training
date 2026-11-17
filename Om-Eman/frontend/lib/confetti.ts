// Tiny canvas confetti engine (B6) — no library. Imported dynamically on the
// first fire() so it never touches the initial bundle. Particle colors are
// read at fire time from the active theme tokens, so confetti always follows
// the current theme. Budget: ≤ 60 particles, DPR ≤ 2, canvas removed ~1.5s.

interface IConfettiOptions {
  x: number;
  y: number;
}

interface IParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

const MAX_PARTICLES = 60;
const MAX_DPR = 2;
const LIFETIME_MS = 1500;

const readThemeColors = (): string[] => {
  const styles = getComputedStyle(document.documentElement);
  return (["--color-primary", "--color-accent", "--color-glow"] as const)
    .map((token) => styles.getPropertyValue(token).trim())
    .filter((color) => color !== "");
};

const fire = ({ x, y }: IConfettiOptions): void => {
  const colors = readThemeColors();
  if (colors.length === 0) return;

  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const canvas = document.createElement("canvas");
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:60;";
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  if (!context) {
    canvas.remove();
    return;
  }
  context.scale(dpr, dpr);

  const start = performance.now();
  const particles: IParticle[] = Array.from({ length: MAX_PARTICLES }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 5;
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 4 + Math.random() * 4,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)] ?? colors[0]!,
    };
  });

  const frame = (now: number): void => {
    const elapsed = now - start;
    context.clearRect(0, 0, width, height);
    const progress = elapsed / LIFETIME_MS;

    for (const particle of particles) {
      particle.vy += 0.25;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.rotationSpeed;

      context.save();
      context.globalAlpha = Math.max(1 - progress, 0);
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.fillStyle = particle.color;
      context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.6);
      context.restore();
    }

    if (elapsed < LIFETIME_MS) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  };

  requestAnimationFrame(frame);
};

export type TFireConfetti = (options: IConfettiOptions) => void;
export { fire };
