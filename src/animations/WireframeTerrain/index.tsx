import { useRef, useEffect } from "react";

export default function WireframeTerrain() {
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

      ctx.fillStyle = "rgba(5, 5, 10, 0.4)"; // 拖尾
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const horizonY = height * 0.4; // 地平线位置
      const rows = 25;
      const cols = 30;
      time += 0.05;

      ctx.strokeStyle = "#c084fc";
      ctx.lineWidth = 1.5;

      for (let z = 0; z < rows; z++) {
        // 透视计算：越远的行越靠近地平线
        const zRatio = z / rows;
        const y = horizonY + (height - horizonY) * Math.pow(zRatio, 2);

        ctx.beginPath();
        for (let x = 0; x <= cols; x++) {
          const xRatio = x / cols;
          const xPos = (xRatio - 0.5) * width * 2 * zRatio + cx;

          // 用正弦波生成地形高度
          const noise =
            Math.sin(xRatio * 10 + time) *
            Math.cos(zRatio * 5 + time * 0.5) *
            50;
          const yPos = y + noise * zRatio; // 越近的起伏越明显

          if (x === 0) ctx.moveTo(xPos, yPos);
          else ctx.lineTo(xPos, yPos);
        }
        // 根据距离改变亮度
        ctx.strokeStyle = `rgba(192, 132, 252, ${zRatio})`;
        ctx.stroke();
      }

      // 画纵向的线
      for (let x = 0; x <= cols; x++) {
        const xRatio = x / cols;
        ctx.beginPath();
        for (let z = 0; z < rows; z++) {
          const zRatio = z / rows;
          const y = horizonY + (height - horizonY) * Math.pow(zRatio, 2);
          const xPos = (xRatio - 0.5) * width * 2 * zRatio + cx;
          const noise =
            Math.sin(xRatio * 10 + time) *
            Math.cos(zRatio * 5 + time * 0.5) *
            50;
          const yPos = y + noise * zRatio;

          if (z === 0) ctx.moveTo(xPos, yPos);
          else ctx.lineTo(xPos, yPos);
        }
        ctx.strokeStyle = `rgba(56, 189, 248, 0.3)`;
        ctx.stroke();
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
