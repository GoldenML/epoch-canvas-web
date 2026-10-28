import { useRef, useEffect } from "react";

export default function Ripples() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;
    let ripples: { x: number; y: number; radius: number; alpha: number }[] = [];

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

    const draw = () => {
      // ⭐ 修复：继续请求下一帧
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = "rgba(13, 13, 18, 0.1)";
      ctx.fillRect(0, 0, width, height);

      if (Math.random() < 0.05) {
        ripples.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0,
          alpha: 1,
        });
      }

      ripples = ripples.filter((r) => {
        r.radius += 2;
        r.alpha -= 0.015;

        if (r.alpha > 0) {
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);

          const gradient = ctx.createRadialGradient(
            r.x,
            r.y,
            r.radius - 2,
            r.x,
            r.y,
            r.radius + 2,
          );
          gradient.addColorStop(0, `rgba(56, 189, 248, 0)`);
          gradient.addColorStop(0.5, `rgba(56, 189, 248, ${r.alpha})`);
          gradient.addColorStop(1, `rgba(56, 189, 248, 0)`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();
          return true;
        }
        return false;
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
