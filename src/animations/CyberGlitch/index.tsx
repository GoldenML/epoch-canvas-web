import { useRef, useEffect } from "react";

export default function CyberGlitch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;

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
      // ⭐ 关键修复 1：如果宽高还没计算出来（为 0），则跳过当前帧，等待下一帧
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.3;

      // 红通道
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.arc(cx + (Math.random() * 10 - 5), cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // 蓝通道
      ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(cx - (Math.random() * 10 - 5), cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // 核心白色
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // 随机生成故障横条
      if (Math.random() > 0.6) {
        const numStrips = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < numStrips; i++) {
          // ⭐ 关键修复 2：确保截取区域 h 和 y 都是整数，且不会越界
          const h = Math.floor(Math.random() * 20) + 2;
          const y = Math.floor(Math.random() * (height - h));

          // 安全校验，确保宽高大于 0
          if (y >= 0 && h > 0 && width > 0) {
            const imageData = ctx.getImageData(0, y, Math.floor(width), h);
            const offsetX = Math.floor((Math.random() - 0.5) * 40);

            // putImageData 会完全覆盖原位置像素，所以这里可能会有闪烁感，这就是 Glitch 的灵魂
            ctx.putImageData(imageData, offsetX, y);

            // 叠加彩色线条
            ctx.fillStyle =
              Math.random() > 0.5 ? "rgba(255,0,0,0.3)" : "rgba(0,255,255,0.3)";
            ctx.fillRect(0, y, width, h);
          }
        }
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
