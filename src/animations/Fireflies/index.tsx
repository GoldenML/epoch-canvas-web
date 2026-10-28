import { useRef, useEffect } from "react";

export default function Fireflies() {
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
    let flies: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      phase: number;
      speed: number;
    }[] = [];

    // ⭐ 提取初始化函数
    const initFlies = (w: number, h: number) => {
      flies = [];
      for (let i = 0; i < 80; i++) {
        // 增加一点数量
        flies.push({
          x: Math.random() * w, // 确保 w 和 h 是有效数值
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.05 + 0.02,
        });
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;

        // ⭐ 核心修复：只有当宽高都大于 0 时，才进行画布设置和粒子初始化
        if (width > 0 && height > 0) {
          const dpr = window.devicePixelRatio || 1;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

          // 如果粒子为空，或者尺寸发生变化，重新初始化位置
          if (flies.length === 0) {
            initFlies(width, height);
          }
        }
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const draw = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // ⭐ 用带有透明度的深蓝/黑背景清屏，产生柔和的拖尾
      ctx.fillStyle = "rgba(10, 10, 15, 0.25)";
      ctx.fillRect(0, 0, width, height);

      time += 0.01;

      flies.forEach((f) => {
        // 随机摆动
        f.vx += (Math.random() - 0.5) * 0.08;
        f.vy += (Math.random() - 0.5) * 0.08;

        // 限制速度
        const speed = Math.hypot(f.vx, f.vy);
        if (speed > 1.5) {
          f.vx = (f.vx / speed) * 1.5;
          f.vy = (f.vy / speed) * 1.5;
        }

        f.x += f.vx;
        f.y += f.vy;

        // 边缘反弹（留一点内边距，防止卡边）
        if (f.x < 0 || f.x > width) f.vx *= -1;
        if (f.y < 0 || f.y > height) f.vy *= -1;

        // 呼吸灯效果
        f.phase += f.speed;
        const alpha = ((Math.sin(f.phase) + 1) / 2) * 0.8 + 0.2;

        // ⭐ 绘制光晕 (把颜色调亮，改成黄绿色)
        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 20);
        gradient.addColorStop(0, `rgba(190, 255, 100, ${alpha})`);
        gradient.addColorStop(0.4, `rgba(150, 255, 50, ${alpha * 0.5})`);
        gradient.addColorStop(1, "rgba(150, 255, 50, 0)");

        ctx.beginPath();
        ctx.arc(f.x, f.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // 绘制核心亮点
        ctx.beginPath();
        ctx.arc(f.x, f.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 220, ${alpha})`;
        ctx.fill();
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
