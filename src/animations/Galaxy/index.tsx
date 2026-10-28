import { useRef, useEffect } from "react";

export default function Galaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;
    let stars: {
      radius: number;
      angle: number;
      size: number;
      color: string;
    }[] = [];
    let time = 0;

    const initStars = (w: number, h: number) => {
      stars = [];
      const maxRadius = Math.min(w, h) * 0.45;
      for (let i = 0; i < 2000; i++) {
        // 越靠近中心，星星越密集
        const radius = Math.pow(Math.random(), 2.5) * maxRadius;
        stars.push({
          radius,
          angle: Math.random() * Math.PI * 2,
          size: Math.random() * 1.5 + 0.5,
          color:
            Math.random() > 0.8
              ? "#c084fc"
              : Math.random() > 0.5
                ? "#38bdf8"
                : "#ffffff",
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
        initStars(width, height);
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const draw = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = "rgba(5, 5, 10, 0.2)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      time += 0.005;

      // 中心黑洞/亮核
      const gradient = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        Math.min(width, height) * 0.2,
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
      gradient.addColorStop(0.2, "rgba(192, 132, 252, 0.4)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(width, height) * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // 绘制星系
      stars.forEach((star) => {
        // 距离中心越近，角速度越快 (开普勒定律近似)
        const angularSpeed = 0.5 / (star.radius + 10);
        star.angle += angularSpeed;

        // 螺旋臂扰动
        const armOffset = Math.sin(star.angle * 2) * 0.2;

        const px = cx + Math.cos(star.angle + armOffset) * star.radius;
        const py = cy + Math.sin(star.angle + armOffset) * star.radius;

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
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
