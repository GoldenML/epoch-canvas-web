import { useRef, useEffect } from "react";

export default function Boids() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;
    const boids: { x: number; y: number; vx: number; vy: number }[] = [];

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (boids.length === 0) {
          for (let i = 0; i < 150; i++) {
            boids.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
            });
          }
        }
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const draw = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // 带有拖尾的半透明背景
      ctx.fillStyle = "rgba(13, 13, 18, 0.2)";
      ctx.fillRect(0, 0, width, height);

      boids.forEach((boid, i) => {
        let alignX = 0,
          alignY = 0; // 匹配速度
        let cohesionX = 0,
          cohesionY = 0; // 向中心靠拢
        let separationX = 0,
          separationY = 0; // 避免碰撞
        let count = 0;
        const perception = 50; // 感知半径

        for (let j = 0; j < boids.length; j++) {
          if (i === j) continue;
          const other = boids[j];
          const dx = other.x - boid.x;
          const dy = other.y - boid.y;
          const dist = Math.hypot(dx, dy);

          if (dist < perception) {
            alignX += other.vx;
            alignY += other.vy;
            cohesionX += other.x;
            cohesionY += other.y;

            if (dist < 20) {
              // 避免碰撞距离
              separationX -= dx / dist;
              separationY -= dy / dist;
            }
            count++;
          }
        }

        if (count > 0) {
          boid.vx += (alignX / count - boid.vx) * 0.05;
          boid.vy += (alignY / count - boid.vy) * 0.05;
          boid.vx += (cohesionX / count - boid.x) * 0.001;
          boid.vy += (cohesionY / count - boid.y) * 0.001;
          boid.vx += separationX * 0.05;
          boid.vy += separationY * 0.05;
        }

        // 限制最大速度
        const speed = Math.hypot(boid.vx, boid.vy);
        const maxSpeed = 3;
        if (speed > maxSpeed) {
          boid.vx = (boid.vx / speed) * maxSpeed;
          boid.vy = (boid.vy / speed) * maxSpeed;
        }

        boid.x += boid.vx;
        boid.y += boid.vy;

        // 边缘环绕
        if (boid.x < 0) boid.x = width;
        if (boid.x > width) boid.x = 0;
        if (boid.y < 0) boid.y = height;
        if (boid.y > height) boid.y = 0;

        // 绘制鸟
        ctx.beginPath();
        ctx.moveTo(boid.x, boid.y);
        ctx.lineTo(boid.x - boid.vx * 2, boid.y - boid.vy * 2);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
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
