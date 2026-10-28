import { useRef, useEffect } from "react";

export default function BrownianMotion() {
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
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }[] = [];

    const initParticles = (w: number, h: number) => {
      particles = [];
      for (let i = 0; i < 80; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 2 + 2,
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
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        // 布朗运动：加入微小的随机加速度
        p.vx += (Math.random() - 0.5) * 0.5;
        p.vy += (Math.random() - 0.5) * 0.5;

        // 限制速度
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 2) {
          p.vx = (p.vx / speed) * 2;
          p.vy = (p.vy / speed) * 2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // 边界反弹
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // 画粒子
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "#14fc56";
        ctx.fill();

        // 检查与其他粒子的距离
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(20, 252, 86, ${1 - dist / 80})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
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
