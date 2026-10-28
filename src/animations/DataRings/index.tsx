import { useRef, useEffect } from "react";

export default function DataRings() {
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

      ctx.fillStyle = "rgba(13, 13, 18, 0.3)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const numBars = 60;
      const radius = Math.min(width, height) * 0.3;
      const fov = 400;

      time += 0.05;

      for (let i = 0; i < numBars; i++) {
        // 计算柱子在 3D 空间中的角度和位置
        const angle = (i / numBars) * Math.PI * 2 + time * 0.5;
        const x3d = Math.cos(angle) * radius;
        const z3d = Math.sin(angle) * radius;

        // 简单的透视投影
        const scale = fov / (fov + z3d);
        const x2d = cx + x3d * scale;
        const y2d = cy + z3d * 0.5 * scale; // 压扁一点，形成椭圆

        // 高度随正弦波跳动
        const barHeight = (Math.sin(i * 0.5 + time * 2) + 1) * 40 * scale;

        // 颜色随深度变化
        const hue = (i / numBars) * 360 + time * 50;
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${scale})`;

        // 绘制柱体
        ctx.fillRect(x2d - 2 * scale, y2d - barHeight, 4 * scale, barHeight);
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
