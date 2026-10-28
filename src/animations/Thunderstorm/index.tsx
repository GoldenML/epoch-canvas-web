import { useRef, useEffect } from "react";

export default function Thunderstorm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;
    let rain: { x: number; y: number; vy: number; len: number }[] = [];
    let flashAlpha = 0; // 闪电的闪光透明度

    const initRain = (w: number, h: number) => {
      rain = [];
      for (let i = 0; i < 200; i++) {
        rain.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vy: Math.random() * 15 + 15,
          len: Math.random() * 20 + 10,
        });
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initRain(width, height);
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const drawLightning = () => {
      // 简单地画一条折线模拟闪电
      ctx.beginPath();
      let lx = Math.random() * width;
      let ly = 0;
      ctx.moveTo(lx, ly);

      while (ly < height) {
        lx += (Math.random() - 0.5) * 40;
        ly += Math.random() * 30 + 10;
        ctx.lineTo(lx, ly);
      }

      ctx.strokeStyle = "rgba(200, 220, 255, 0.8)";
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#fff";
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // 拖影背景
      ctx.fillStyle = `rgba(10, 10, 15, ${flashAlpha > 0 ? 0.1 : 0.3})`;
      ctx.fillRect(0, 0, width, height);

      // 随机触发闪电
      if (Math.random() < 0.01) {
        flashAlpha = 1; // 屏幕闪白
        drawLightning();
      }

      // 屏幕闪光衰减
      if (flashAlpha > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.5})`;
        ctx.fillRect(0, 0, width, height);
        flashAlpha -= 0.05;
      }

      // 绘制雨滴
      ctx.beginPath();
      rain.forEach((r) => {
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x, r.y + r.len);

        r.y += r.vy;
        // 稍微带点倾斜
        r.x -= 1;

        if (r.y > height) {
          r.y = -r.len;
          r.x = Math.random() * width;
        }
      });
      ctx.strokeStyle = "rgba(150, 180, 255, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

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
