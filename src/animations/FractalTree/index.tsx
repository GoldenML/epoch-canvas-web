import { useRef, useEffect } from "react";

export default function FractalTree() {
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

    const drawBranch = (
      x: number,
      y: number,
      len: number,
      angle: number,
      depth: number,
    ) => {
      if (depth === 0 || len < 2) return;

      // 模拟风的效果：越高的树枝摆动越大
      const wind = Math.sin(time + depth * 0.5) * (10 - depth) * 0.05;
      const currentAngle = angle + wind;

      const endX = x + Math.cos(currentAngle) * len;
      const endY = y + Math.sin(currentAngle) * len;

      // 树干颜色渐变
      const hue = 160 - depth * 10;
      ctx.strokeStyle = `hsl(${hue}, 60%, ${30 + depth * 5}%)`;
      ctx.lineWidth = depth * 1.5;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // 秋天落叶（在末端画点）
      if (depth === 1) {
        ctx.beginPath();
        ctx.arc(endX, endY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${Math.random() * 60 + 20}, 80%, 60%)`;
        ctx.fill();
      }

      // 递归分支
      drawBranch(endX, endY, len * 0.75, currentAngle - Math.PI / 6, depth - 1);
      drawBranch(endX, endY, len * 0.75, currentAngle + Math.PI / 6, depth - 1);
    };

    const draw = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = "#0d0d12";
      ctx.fillRect(0, 0, width, height);

      time += 0.05;

      // 从屏幕底部中间开始画
      drawBranch(width / 2, height, height * 0.25, -Math.PI / 2, 10);

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
