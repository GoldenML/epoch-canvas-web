import { useRef, useEffect } from "react";

export default function MagicCircle() {
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

    const drawPolygon = (
      ctx: CanvasRenderingContext2D,
      radius: number,
      sides: number,
    ) => {
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = (i * Math.PI * 2) / sides - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const draw = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = "#0d0d12";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const baseRadius = Math.min(width, height) * 0.3;

      time += 0.01;

      ctx.save();
      ctx.translate(cx, cy);

      // 核心发光
      const gradient = ctx.createRadialGradient(
        0,
        0,
        0,
        0,
        0,
        baseRadius * 1.5,
      );
      gradient.addColorStop(0, "rgba(56, 189, 248, 0.4)");
      gradient.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#38bdf8";

      // 外层：缓慢顺时针旋转的 12 边形
      ctx.save();
      ctx.rotate(time * 0.5);
      drawPolygon(ctx, baseRadius, 12);
      ctx.restore();

      // 中层：逆时针旋转的正方形
      ctx.save();
      ctx.rotate(-time * 0.8);
      ctx.strokeStyle = "rgba(192, 132, 252, 0.9)"; // 紫色
      ctx.shadowColor = "#c084fc";
      drawPolygon(ctx, baseRadius * 0.7, 4);
      ctx.restore();

      // 内层：快速旋转的三角形
      ctx.save();
      ctx.rotate(time * 1.5);
      ctx.strokeStyle = "rgba(255, 255, 255, 1)";
      ctx.shadowColor = "#fff";
      drawPolygon(ctx, baseRadius * 0.4, 3);
      ctx.restore();

      // 绘制一些环绕的符文光点
      for (let i = 0; i < 12; i++) {
        const angle = time + (i * Math.PI * 2) / 12;
        const x = Math.cos(angle) * baseRadius;
        const y = Math.sin(angle) * baseRadius;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }

      ctx.restore();
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
