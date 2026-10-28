import { useRef, useEffect } from "react";

export default function ParticleText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;
    let particles: {
      x: number;
      y: number;
      tx: number;
      ty: number;
      vx: number;
      vy: number;
      color: string;
    }[] = [];

    // 鼠标位置
    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const initParticles = (w: number, h: number) => {
      particles = [];

      // 1. 创建离屏 Canvas 写字
      const offCanvas = document.createElement("canvas");
      offCanvas.width = w;
      offCanvas.height = h;
      const offCtx = offCanvas.getContext("2d");
      if (!offCtx) return;

      offCtx.fillStyle = "#fff";
      offCtx.font = `bold ${Math.min(w, h) * 0.2}px Arial`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText("CANVAS", w / 2, h / 2);

      // 2. 获取像素数据
      const imageData = offCtx.getImageData(0, 0, w, h).data;

      // 3. 采样像素生成粒子 (每隔 4 个像素采样一次，降低粒子数量)
      const gap = 4;
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          const index = (y * w + x) * 4;
          const alpha = imageData[index + 3];

          if (alpha > 128) {
            // 如果不透明
            particles.push({
              x: Math.random() * w, // 初始随机位置
              y: Math.random() * h,
              tx: x, // 目标位置 (文字形状)
              ty: y,
              vx: 0,
              vy: 0,
              color: `hsl(${Math.random() * 60 + 180}, 100%, 60%)`,
            });
          }
        }
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
        initParticles(width, height);
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const draw = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.fillStyle = "rgba(13, 13, 18, 0.2)";
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        // 向目标位置移动的引力
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx += dx * 0.02;
        p.vy += dy * 0.02;

        // 鼠标排斥力
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const distToMouse = Math.hypot(mdx, mdy);

        if (distToMouse < 100) {
          const force = (100 - distToMouse) / 100;
          // 远离鼠标
          p.vx += (mdx / distToMouse) * force * 5;
          p.vy += (mdy / distToMouse) * force * 5;
        }

        // 摩擦力
        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        cursor: "crosshair",
      }}
    />
  );
}
