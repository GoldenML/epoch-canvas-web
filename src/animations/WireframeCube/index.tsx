import { useRef, useEffect } from "react";

export default function WireframeCube() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;

    // 立方体 8 个顶点
    const vertices = [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ];

    // 12 条边（连接顶点的索引）
    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0], // 后面
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4], // 前面
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7], // 连接前后
    ];

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

    let time = 0;
    const size = 100; // 基础尺寸
    const focalLength = 400; // 焦距（控制透视强度）

    const draw = () => {
      ctx.fillStyle = "rgba(13, 13, 18, 0.8)"; // 轻微拖尾
      ctx.fillRect(0, 0, width, height);

      time += 0.02;

      const cx = width / 2;
      const cy = height / 2;

      // 计算旋转矩阵并投影
      const projected: { x: number; y: number; z: number }[] = [];

      vertices.forEach((v) => {
        // 绕 Y 轴旋转
        const x1 = v.x * Math.cos(time) - v.z * Math.sin(time);
        const z1 = v.z * Math.cos(time) + v.x * Math.sin(time);

        // 绕 X 轴旋转
        const y2 = v.y * Math.cos(time * 0.7) - z1 * Math.sin(time * 0.7);
        const z2 = z1 * Math.cos(time * 0.7) + v.y * Math.sin(time * 0.7);

        // 透视投影
        const scale = focalLength / (focalLength + z2 * size);
        const px = cx + x1 * size * scale;
        const py = cy + y2 * size * scale;

        projected.push({ x: px, y: py, z: z2 });
      });

      // 绘制边
      ctx.lineWidth = 2;
      edges.forEach((edge) => {
        const p1 = projected[edge[0]];
        const p2 = projected[edge[1]];

        // 根据 Z 深度改变颜色和透明度，制造空间感
        const depth = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.2, 1 - (depth + 1.5) / 3);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`; // 科技蓝
        ctx.stroke();
      });

      // 绘制顶点
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
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
