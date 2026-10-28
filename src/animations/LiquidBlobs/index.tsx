import { useRef, useEffect } from "react";

export default function LiquidBlobs() {
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

      ctx.clearRect(0, 0, width, height);

      time += 0.01;

      // 叠加模式，让重叠部分发光变亮
      ctx.globalCompositeOperation = "lighter";

      const blobs = [
        { color: "rgba(56, 189, 248, 0.4)", speed: 1, offsetY: 0, phase: 0 },
        {
          color: "rgba(192, 132, 252, 0.4)",
          speed: 1.2,
          offsetY: 20,
          phase: Math.PI,
        },
        {
          color: "rgba(248, 113, 113, 0.4)",
          speed: 0.8,
          offsetY: -20,
          phase: Math.PI / 2,
        },
      ];

      blobs.forEach((blob) => {
        ctx.beginPath();
        const cx = width / 2;
        const cy = height / 2 + blob.offsetY;
        const baseRadius = Math.min(width, height) * 0.3;

        // 绘制受到正弦波扰动的闭合形状
        for (let i = 0; i <= 360; i += 5) {
          const angle = (i * Math.PI) / 180;
          const dist =
            baseRadius +
            Math.sin(angle * 4 + time * blob.speed) * 15 +
            Math.cos(angle * 3 - time) * 10;
          const x = cx + Math.cos(angle) * dist;
          const y = cy + Math.sin(angle) * dist;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.fillStyle = blob.color;
        ctx.fill();
      });

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
