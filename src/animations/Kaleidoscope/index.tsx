import { useRef, useEffect } from "react";

export default function Kaleidoscope() {
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
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const draw = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = "rgba(13, 13, 18, 0.2)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.4;
      const slices = 12; // 对称数量

      time += 0.02;

      ctx.globalCompositeOperation = "lighter";

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.5);

      for (let i = 0; i < slices; i++) {
        ctx.rotate((Math.PI * 2) / slices);
        ctx.beginPath();

        // 绘制花瓣形状
        const petalRadius = radius * (0.5 + Math.sin(time + i) * 0.2);
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(petalRadius / 2, petalRadius / 2, 0, petalRadius);
        ctx.quadraticCurveTo(-petalRadius / 2, petalRadius / 2, 0, 0);

        ctx.fillStyle = `hsla(${i * (360 / slices) + time * 50}, 80%, 60%, 0.3)`;
        ctx.fill();
        ctx.strokeStyle = `hsla(${i * (360 / slices) + time * 50}, 100%, 70%, 0.8)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.restore();
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
