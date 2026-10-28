import { useRef, useEffect } from "react";

// ⭐ 1. 定义 Props 接口，设置默认值
interface Props {
  gravity?: number;
  ballCount?: number;
}

export default function PhysicsBalls({ gravity = 0.5, ballCount = 20 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;
    let balls: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      color: string;
    }[] = [];

    const friction = 0.99;
    const bounce = 0.8;

    const initBalls = (w: number, h: number) => {
      balls = [];
      // ⭐ 2. 使用传入的 ballCount
      for (let i = 0; i < ballCount; i++) {
        const r = Math.random() * 15 + 10;
        balls.push({
          x: Math.random() * (w - r * 2) + r,
          y: Math.random() * (h / 2),
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          r,
          color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        });
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initBalls(width, height);
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const resolveCollisions = () => {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const dx = balls[j].x - balls[i].x;
          const dy = balls[j].y - balls[i].y;
          const dist = Math.hypot(dx, dy);
          const minDist = balls[i].r + balls[j].r;

          if (dist < minDist) {
            const angle = Math.atan2(dy, dx);
            const overlap = minDist - dist;

            const cx = (Math.cos(angle) * overlap) / 2;
            const cy = (Math.sin(angle) * overlap) / 2;
            balls[i].x -= cx;
            balls[i].y -= cy;
            balls[j].x += cx;
            balls[j].y += cy;

            const tempVx = balls[i].vx;
            const tempVy = balls[i].vy;
            balls[i].vx = balls[j].vx * bounce;
            balls[i].vy = balls[j].vy * bounce;
            balls[j].vx = tempVx * bounce;
            balls[j].vy = tempVy * bounce;
          }
        }
      }
    };

    const draw = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      balls.forEach((b) => {
        // ⭐ 3. 使用传入的 gravity
        b.vy += gravity;
        b.vx *= friction;
        b.vy *= friction;
        b.x += b.vx;
        b.y += b.vy;

        if (b.x + b.r > width) {
          b.x = width - b.r;
          b.vx *= -bounce;
        }
        if (b.x - b.r < 0) {
          b.x = b.r;
          b.vx *= -bounce;
        }
        if (b.y + b.r > height) {
          b.y = height - b.r;
          b.vy *= -bounce;
        }
        if (b.y - b.r < 0) {
          b.y = b.r;
          b.vy *= -bounce;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fill();
      });

      resolveCollisions();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
    // ⭐ 4. 关键：将 gravity 和 ballCount 加入依赖项，当用户拖动滑块时，动画会重新初始化！
  }, [gravity, ballCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
