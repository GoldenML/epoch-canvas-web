import { useRef, useEffect } from "react";

export default function GeometricSpiral() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    });

    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const draw = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const cx = width / 2;
      const cy = height / 2;

      // 深色半透明背景，产生拖尾残影
      ctx.fillStyle = "rgba(13, 13, 18, 0.2)";
      ctx.fillRect(0, 0, width, height);

      const maxRadius = Math.max(width, height) / 2;
      const particleCount = 300;

      time += 0.02;

      // 使颜色叠加发光
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particleCount; i++) {
        const radius = (i / particleCount) * maxRadius;
        const angle = i * 0.1 + time;

        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        // 动态彩色
        const hue = (i / particleCount) * 360 + time * 50;
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.8)`;

        ctx.beginPath();
        const size = (1 - i / particleCount) * 4 + 1;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

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
