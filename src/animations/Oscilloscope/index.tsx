import { useRef, useEffect } from "react";

export default function Oscilloscope() {
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

      ctx.fillStyle = "#0d0d12";
      ctx.fillRect(0, 0, width, height);

      time += 0.05;
      const cy = height / 2;

      // 绘制多条不同频率的线
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        const color = k === 0 ? "#38bdf8" : k === 1 ? "#c084fc" : "#facc15";

        for (let x = 0; x <= width; x += 5) {
          // 叠加正弦波和噪音感
          const envelope =
            Math.sin(x * 0.002 + time) * Math.cos(x * 0.001 - time * 0.5);
          const y = cy + Math.sin(x * 0.02 + time + k) * 50 * envelope;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
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
