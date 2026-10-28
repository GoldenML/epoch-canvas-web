import { useRef, useEffect } from "react";

export default function PlasmaFire() {
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

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)"; // 半透明黑底，产生残影
      ctx.fillRect(0, 0, width, height);

      time += 0.05;

      // 叠加模式，让颜色变亮
      ctx.globalCompositeOperation = "lighter";

      // 绘制 3 个不同颜色的等离子光晕
      const colors = [
        { r: 255, g: 0, b: 0 }, // 红
        { r: 255, g: 150, b: 0 }, // 橙
        { r: 0, g: 200, b: 255 }, // 蓝
      ];

      colors.forEach((color, index) => {
        const cx = width / 2 + Math.sin(time * 0.5 + index) * width * 0.2;
        const cy = height * 0.7 + Math.cos(time * 0.3 + index) * height * 0.1;
        const radius =
          Math.min(width, height) * 0.4 + Math.sin(time + index) * 30;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        gradient.addColorStop(
          0,
          `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`,
        );
        gradient.addColorStop(
          0.5,
          `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`,
        );
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
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
