import { useRef, useEffect } from "react";

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let fireworks: Firework[] = [];

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.contentRect;
        width = rect.width;
        height = rect.height;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const random = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const colors = ["#ff0043", "#14fc56", "#1e7fff", "#e60aff", "#ffbf00"];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = random(0, Math.PI * 2);
        const speed = random(1, 8);
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 100;
        this.maxLife = random(50, 100);
        this.color = color;
      }
      update() {
        this.vx *= 0.96; // 空气阻力
        this.vy *= 0.96;
        this.vy += 0.05; // 重力
        this.x += this.vx;
        this.y += this.vy;
        this.life -= 1;
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = Math.max(this.life / this.maxLife, 0);
        ctx.fill();
      }
    }

    class Firework {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
      constructor() {
        this.x = random(width * 0.2, width * 0.8);
        this.y = height;
        this.targetY = random(height * 0.1, height * 0.4);
        this.vy = random(-8, -12);
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.y += this.vy;
        if (this.y <= this.targetY) {
          // 爆炸
          for (let i = 0; i < 100; i++) {
            particles.push(new Particle(this.x, this.y, this.color));
          }
          return false;
        }
        return true;
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const draw = () => {
      // 制造拖尾效果
      ctx.fillStyle = "rgba(13, 13, 18, 0.2)";
      ctx.fillRect(0, 0, width, height);

      // 随机发射
      if (Math.random() < 0.03) {
        fireworks.push(new Firework());
      }

      fireworks = fireworks.filter((f) => {
        f.draw(ctx);
        return f.update();
      });

      particles = particles.filter((p) => {
        p.update();
        p.draw(ctx);
        return p.life > 0;
      });

      ctx.globalAlpha = 1;
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
