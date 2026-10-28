import { useRef, useEffect } from "react";

export default function Spirograph() {
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

      // 轻微清空制造拖尾
      ctx.fillStyle = "rgba(13, 13, 18, 0.05)";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.4; // 大圆半径
      const r = R * 0.6; // 小圆半径
      const d = R * 0.3; // 画笔距离小圆心距离

      // 用时间改变参数，让图案不断演变
      const maxAngle = Math.PI * 2 * 10; // 画 10 圈

      ctx.beginPath();
      for (let a = 0; a < maxAngle; a += 0.02) {
        // 内摆线数学公式
        const x =
          cx + (R - r) * Math.cos(a) + d * Math.cos(((R - r) / r) * a + time);
        const y =
          cy + (R - r) * Math.sin(a) - d * Math.sin(((R - r) / r) * a + time);

        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `hsl(${(time * 50) % 360}, 80%, 60%)`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.stroke();
      ctx.shadowBlur = 0;

      time += 0.01;

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
