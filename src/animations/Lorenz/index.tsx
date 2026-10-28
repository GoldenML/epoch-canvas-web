import { useRef, useEffect } from "react";

export default function Lorenz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;
    let time = 0;

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
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    // 洛伦兹方程参数
    const a = 10,
      b = 28,
      c = 8 / 3;
    let x = 0.01,
      y = 0,
      z = 0;
    const dt = 0.01;

    const draw = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // 半透明黑底，产生残影
      ctx.fillStyle = "rgba(13, 13, 18, 0.05)";
      ctx.fillRect(0, 0, width, height);

      const scale = Math.min(width, height) * 0.015;
      const cx = width / 2;
      const cy = height / 2;

      // 每次绘制一小段轨迹
      for (let i = 0; i < 20; i++) {
        const dx = a * (y - x) * dt;
        const dy = (x * (b - z) - y) * dt;
        const dz = (x * y - c * z) * dt;

        x += dx;
        y += dy;
        z += dz;

        // 3D 投影到 2D
        const px = cx + x * scale;
        const py = cy + (z - 25) * scale; // Z 轴映射到屏幕 Y 轴，并做一点偏移居中

        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${time % 360}, 80%, 60%)`;
        ctx.fill();
      }

      time += 0.5;
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
