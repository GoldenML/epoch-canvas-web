import { useRef, useEffect } from "react";

export default function Aurora() {
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
      // ⭐ 修复：继续请求下一帧
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = "rgba(5, 5, 10, 1)";
      ctx.fillRect(0, 0, width, height);

      time += 0.01;
      ctx.shadowBlur = 40;

      const colors = [
        "rgba(56, 189, 248, 0.4)",
        "rgba(192, 132, 252, 0.4)",
        "rgba(52, 211, 153, 0.4)",
      ];

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, height);

        for (let x = 0; x <= width; x += 10) {
          const y =
            height / 2 +
            Math.sin(x * 0.005 + time + i * 2) * 80 +
            Math.cos(x * 0.002 - time) * 40;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        ctx.fillStyle = colors[i];
        ctx.shadowColor = colors[i].replace("0.4", "1");
        ctx.fill();
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
