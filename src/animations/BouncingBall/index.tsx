import { useRef, useEffect } from "react";

export default function BouncingBall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // --- 小球的物理属性 ---
    const ball = {
      x: 100,
      y: 100,
      vx: 3, // X轴速度
      vy: 2, // Y轴速度
      radius: 30, // 半径
      color: "#38bdf8", // 亮蓝色
    };

    // --- 画布尺寸自适应逻辑 ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1; // 适配高清屏，防止模糊

        // 设置实际渲染分辨率
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        // 重置变换并缩放上下文，使后续绘制以 CSS 像素为单位
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    });

    // 监听父容器尺寸变化（如果是全屏，容器的宽高会变）
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // --- 核心绘制动画逻辑 ---
    const draw = () => {
      // 获取当前 CSS 尺寸
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // 1. 清空画布（每一帧都要清空上一帧的内容）
      ctx.clearRect(0, 0, width, height);

      // 2. 更新小球位置
      ball.x += ball.vx;
      ball.y += ball.vy;

      // 3. 碰撞检测（左右边界）
      if (ball.x + ball.radius > width || ball.x - ball.radius < 0) {
        ball.vx = -ball.vx;
      }
      // 碰撞检测（上下边界）
      if (ball.y + ball.radius > height || ball.y - ball.radius < 0) {
        ball.vy = -ball.vy;
      }

      // 4. 绘制小球
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

      // 给小球加个渐变色或者阴影显得高级点
      ctx.fillStyle = ball.color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = ball.color;

      ctx.fill();
      ctx.closePath();

      // 5. 循环下一帧
      animationFrameId = requestAnimationFrame(draw);
    };

    // 启动动画
    draw();

    // --- 组件卸载时清理 ---
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 注意：这里的样式必须是 100% 撑满父容器
  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
