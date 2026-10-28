import { useRef, useEffect } from "react";

export default function DNAHelix() {
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
      const numPoints = 100;
      const radius = Math.min(width, height) * 0.25;

      time += 0.05;

      const points = [];

      for (let i = 0; i < numPoints; i++) {
        // 计算 Z 轴（用来做 3D 透视缩放）
        const z = (i - numPoints / 2) * 2;
        const scale = 200 / (200 + z);

        // 两条螺旋线的角度
        const angle1 = i * 0.2 + time;
        const angle2 = i * 0.2 + Math.PI + time; // 相差 180 度

        // 投影到 2D 平面
        const x1 = cx + Math.cos(angle1) * radius * scale;
        const y1 = cy + z * scale;

        const x2 = cx + Math.cos(angle2) * radius * scale;
        const y2 = cy + z * scale;

        // 横档连接线
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${scale * 0.5})`;
        ctx.lineWidth = 2 * scale;
        ctx.stroke();

        // 记录粒子的绘制顺序，按 Z 轴排序（先画远的，再画近的）
        points.push({ x: x1, y: y1, scale, color: "#38bdf8" });
        points.push({ x: x2, y: y2, scale, color: "#c084fc" });
      }

      // 按 scale 排序（scale 越小代表越远）
      points.sort((a, b) => a.scale - b.scale);

      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
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
