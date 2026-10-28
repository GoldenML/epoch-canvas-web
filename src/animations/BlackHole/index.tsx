import { useRef, useEffect } from "react";

export default function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;
    let particles: {
      angle: number;
      radius: number;
      speed: number;
      color: string;
    }[] = [];

    const initParticles = (w: number, h: number) => {
      particles = [];
      const maxRadius = Math.max(w, h) * 0.8;
      for (let i = 0; i < 800; i++) {
        particles.push({
          angle: Math.random() * Math.PI * 2,
          radius: Math.random() * maxRadius + 20,
          speed: Math.random() * 0.02 + 0.01,
          color: `hsl(${Math.random() * 60 + 15}, 100%, ${Math.random() * 30 + 50}%)`,
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
        initParticles(width, height);
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const draw = () => {
      // ⭐ 修复：继续请求下一帧
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.fillStyle = "#000";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ff5500";
      ctx.fill();
      ctx.shadowBlur = 0;

      particles.forEach((p) => {
        p.radius -= 0.5;
        p.angle += p.speed * (50 / Math.max(p.radius, 1));

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;

        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        if (p.radius < 30) {
          p.radius = Math.max(width, height) * 0.8;
          p.angle = Math.random() * Math.PI * 2;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
