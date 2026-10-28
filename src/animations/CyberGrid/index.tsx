import { useRef, useEffect } from "react";

export default function CyberGrid() {
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

      // 背景渐变 (夕阳天空)
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, "#0d0d12");
      bgGradient.addColorStop(0.5, "#1a0b2e");
      bgGradient.addColorStop(1, "#0d0d12");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.5; // 地平线在中间
      time += 0.02;

      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.8)";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#38bdf8";

      // 绘制纵向线 (汇聚到地平线中心)
      for (let i = -20; i <= 20; i++) {
        const x = cx + i * (width / 10);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        // 越往下，张开得越大
        ctx.lineTo(cx + (x - cx) * 4, height);
        ctx.stroke();
      }

      // 绘制横向线 (利用透视公式)
      for (let i = 0; i < 20; i++) {
        // (i + time) % 20 产生无限向前推进的效果
        const z = (i + time) % 20;
        if (z === 0) continue;

        // 透视公式：y = cy + (height - cy) / z
        const y = cy + (height - cy) / z;

        if (y <= height) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          // 越远(靠上)的线越暗
          ctx.strokeStyle = `rgba(192, 132, 252, ${1 - z / 20})`;
          ctx.stroke();
        }
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
