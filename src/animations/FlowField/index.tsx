import { useRef, useEffect } from "react";

export default function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
    }[] = [];
    let width = 0,
      height = 0;

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 400; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
          color: `hsl(${Math.random() * 60 + 180}, 100%, 60%)`, // 青色/蓝色系
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
        ctx.fillStyle = "#0d0d12";
        ctx.fillRect(0, 0, width, height);
        initParticles();
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    let time = 0;

    const draw = () => {
      // 制造长拖尾效果，透明度设得非常低
      ctx.fillStyle = "rgba(13, 13, 18, 0.05)";
      ctx.fillRect(0, 0, width, height);

      time += 0.002;

      particles.forEach((p) => {
        // 用正弦余弦模拟流场角度
        const angle =
          (Math.cos(p.x * 0.005 + time) + Math.sin(p.y * 0.005 + time)) *
          Math.PI;

        p.vx += Math.cos(angle) * 0.2;
        p.vy += Math.sin(angle) * 0.2;

        // 限制速度
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 2) {
          p.vx = (p.vx / speed) * 2;
          p.vy = (p.vy / speed) * 2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // 越界重置
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.vx = 0;
          p.vy = 0;
        }

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.stroke();
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
