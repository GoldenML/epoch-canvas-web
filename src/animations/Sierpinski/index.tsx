import { useRef, useEffect } from "react";

export default function Sierpinski() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;
    let vertices: { x: number; y: number }[] = [];
    let currentPoint = { x: 0, y: 0 };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        vertices = [
          { x: width / 2, y: 50 },
          { x: 50, y: height - 50 },
          { x: width - 50, y: height - 50 },
        ];
        currentPoint = { x: Math.random() * width, y: Math.random() * height };
        ctx.fillStyle = "#0d0d12";
        ctx.fillRect(0, 0, width, height);
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const draw = () => {
      // ⭐ 修复：如果宽高还没准备好，继续请求下一帧，千万别 return 等死
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      for (let i = 0; i < 100; i++) {
        const randomVertex = vertices[Math.floor(Math.random() * 3)];
        currentPoint.x = (currentPoint.x + randomVertex.x) / 2;
        currentPoint.y = (currentPoint.y + randomVertex.y) / 2;

        ctx.beginPath();
        ctx.arc(currentPoint.x, currentPoint.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${Math.random() * 60 + 280}, 100%, 60%)`;
        ctx.fill();
      }

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
