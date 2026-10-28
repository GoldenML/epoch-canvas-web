import { useRef, useEffect } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let drops: number[] = [];
    const fontSize = 16;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*".split("");

    const init = (width: number, height: number) => {
      const columns = Math.ceil(width / fontSize);
      drops = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * (height / fontSize);
      }
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        init(width, height);
      }
    });

    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const draw = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        // 随机生成白色字符，增强层次感
        ctx.fillStyle = Math.random() > 0.95 ? "#fff" : "#0f0";

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (y > 0) ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
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
