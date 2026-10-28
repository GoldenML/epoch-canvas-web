import { useRef, useEffect } from "react";

export default function Radar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;
    let angle = 0;
    let targets: { x: number; y: number; time: number }[] = [];

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

      // 雷达背景色
      ctx.fillStyle = "rgba(0, 15, 0, 1)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.4;

      // 画网格
      ctx.strokeStyle = "rgba(0, 255, 0, 0.2)";
      ctx.lineWidth = 1;

      // 同心圆
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 十字线
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // 扫描扇形渐变
      angle += 0.02;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, "rgba(0, 255, 0, 0.8)");
      gradient.addColorStop(1, "rgba(0, 255, 0, 0)");

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + 0.5); // 扇区宽度
      ctx.lineTo(cx, cy);
      ctx.fillStyle = gradient;
      ctx.fill();

      // 生成目标
      if (Math.random() < 0.05) {
        const r = Math.random() * radius;
        const a = Math.random() * Math.PI * 2;
        targets.push({
          x: cx + Math.cos(a) * r,
          y: cy + Math.sin(a) * r,
          time: 1.0, // 初始亮度
        });
      }

      // 绘制目标
      targets = targets.filter((t) => {
        t.time -= 0.005; // 慢慢消失
        if (t.time > 0) {
          ctx.beginPath();
          ctx.arc(t.x, t.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 255, 0, ${t.time})`;
          ctx.fill();
          return true;
        }
        return false;
      });

      // 雷达中心点
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#0f0";
      ctx.fill();

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
