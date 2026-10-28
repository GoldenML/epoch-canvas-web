import { useRef, useEffect } from "react";

export default function Waves() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = canvas.parentElement?.clientHeight || 200;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 渐变色
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#818cf8");
      gradient.addColorStop(1, "#c084fc");

      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      // 绘制正弦曲线
      for (let x = 0; x <= canvas.width; x += 5) {
        const y = Math.sin(x * 0.02 + offset) * 20 + canvas.height / 2;
        ctx.lineTo(x, y);
      }

      ctx.lineWidth = 3;
      ctx.strokeStyle = gradient;
      ctx.stroke();

      offset += 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
