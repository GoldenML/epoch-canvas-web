import { useRef, useEffect } from "react";

export default function PendulumWave() {
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

      ctx.fillStyle = "rgba(13, 13, 18, 0.3)"; // 拖尾
      ctx.fillRect(0, 0, width, height);

      const numPendulums = 30;
      const maxAngle = Math.PI / 6; // 摆动最大角度
      const pivotY = height * 0.2; // 悬挂点 Y 坐标
      const baseLength = height * 0.6; // 基础长度

      time += 0.02;

      for (let i = 0; i < numPendulums; i++) {
        // 不同的摆长导致不同的周期
        const length = baseLength * (1 - i * 0.02);
        const pivotX =
          width / 2 + (i - numPendulums / 2) * ((width * 0.8) / numPendulums);

        // 简谐运动公式
        const angle =
          maxAngle * Math.sin(time * (1 + i * 0.1)) * Math.cos(time * 0.5);

        const bobX = pivotX + Math.sin(angle) * length;
        const bobY = pivotY + Math.cos(angle) * length;

        // 画线
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // 画球
        ctx.beginPath();
        ctx.arc(bobX, bobY, 6, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${i * 12}, 80%, 60%)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;
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
