import { useRef, useEffect } from "react";

export default function DoublePendulum() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;

    // 物理参数
    // 初始角度稍微给一点点差异，混沌系统会放大这个差异
    let a1 = Math.PI / 2 + 0.001;
    let a2 = Math.PI / 2;
    let a1_v = 0,
      a2_v = 0; // 角速度

    const g = 1; // 重力
    const m1 = 10,
      m2 = 10; // 质量
    const l1 = 1,
      l2 = 1; // 摆长比例
    const dt = 0.1; // ⭐ 核心修复：时间步长 (控制动画速度)

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
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // ⭐ 调整了透明度，让轨迹保留得更久，形成丝滑的线迹
      ctx.fillStyle = "rgba(13, 13, 18, 0.08)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 - 50;
      const scale = Math.min(width, height) * 0.2;

      // 物理公式计算
      const num1 = -g * (2 * m1 + m2) * Math.sin(a1);
      const num2 = -m2 * g * Math.sin(a1 - 2 * a2);
      const num3 = -2 * Math.sin(a1 - a2) * m2;
      const num4 = a2_v * a2_v * l2 + a1_v * a1_v * l1 * Math.cos(a1 - a2);
      const den = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
      const a1_a = (num1 + num2 + num3 * num4) / den;

      const num5 = 2 * Math.sin(a1 - a2);
      const num6 = a1_v * a1_v * l1 * (m1 + m2);
      const num7 = g * (m1 + m2) * Math.cos(a1);
      const num8 = a2_v * a2_v * l2 * m2 * Math.cos(a1 - a2);
      const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
      const a2_a = (num5 * (num6 + num7 + num8)) / den2;

      // ⭐ 核心修复：积分时乘以 dt
      a1_v += a1_a * dt;
      a2_v += a2_a * dt;
      a1 += a1_v * dt;
      a2 += a2_v * dt;

      // 坐标计算
      const x1 = cx + l1 * scale * Math.sin(a1);
      const y1 = cy + l1 * scale * Math.cos(a1);
      const x2 = x1 + l2 * scale * Math.sin(a2);
      const y2 = y1 + l2 * scale * Math.cos(a2);

      // 绘制轨迹点（只有第二个摆锤会留下轨迹）
      ctx.beginPath();
      ctx.arc(x2, y2, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#c084fc";
      ctx.fill();

      // 绘制摆臂
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 绘制第一个摆锤
      ctx.beginPath();
      ctx.arc(x1, y1, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();

      // 绘制第二个摆锤 (发光核心)
      ctx.beginPath();
      ctx.arc(x2, y2, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#c084fc";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#c084fc";
      ctx.fill();
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
