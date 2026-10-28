import { useRef, useEffect } from "react";

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; z: number; pz: number }[] = [];
    const numStars = 300;
    const speed = 8;

    const init = (width: number, height: number) => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width * 2 - width,
          y: Math.random() * height * 2 - height,
          z: Math.random() * width,
          pz: 0,
        });
      }
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
      const cx = width / 2;
      const cy = height / 2;

      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"; // 拖尾效果
      ctx.fillRect(0, 0, width, height);

      stars.forEach((star) => {
        star.pz = star.z;
        star.z -= speed;

        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width * 2 - width;
          star.y = Math.random() * height * 2 - height;
          star.pz = star.z;
        }

        const sx = (star.x / star.z) * width + cx;
        const sy = (star.y / star.z) * height + cy;
        const px = (star.x / star.pz) * width + cx;
        const py = (star.y / star.pz) * height + cy;

        const size = (1 - star.z / width) * 3;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - star.z / width})`;
        ctx.lineWidth = size;
        ctx.stroke();
      });

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
