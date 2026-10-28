import { useRef, useEffect } from "react";

export default function PixelFire() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;

    const pixelSize = 4; // 像素块大小
    let cols = 0,
      rows = 0;
    let firePixels: number[] = [];

    // 调色板：从黑到红到黄到白
    const palette = [
      [7, 7, 7],
      [31, 7, 7],
      [71, 15, 7],
      [103, 31, 7],
      [143, 39, 7],
      [175, 63, 7],
      [199, 71, 7],
      [223, 91, 7],
      [223, 119, 7],
      [215, 155, 7],
      [215, 175, 7],
      [215, 195, 7],
      [255, 231, 7],
      [255, 255, 255],
    ];

    const init = (w: number, h: number) => {
      cols = Math.floor(w / pixelSize);
      rows = Math.floor(h / pixelSize);
      firePixels = new Array(cols * rows).fill(0);

      // 初始化底部火源
      for (let i = 0; i < cols; i++) {
        firePixels[(rows - 1) * cols + i] = palette.length - 1;
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
        init(width, height);
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const draw = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // 1. 传播火焰算法
      for (let y = rows - 1; y >= 0; y--) {
        for (let x = 0; x < cols; x++) {
          const index = y * cols + x;
          if (y === rows - 1) {
            // 最底部的火源随机闪烁
            firePixels[index] =
              Math.random() > 0.5 ? palette.length - 1 : palette.length - 2;
          } else {
            // 从下面一行随机抽取热量向上传播
            const rand = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
            const targetX = Math.max(0, Math.min(cols - 1, x + rand));
            const targetIndex = (y + 1) * cols + targetX;

            let newVal =
              firePixels[targetIndex] - (Math.random() > 0.7 ? 1 : 0); // 随机降温
            if (newVal < 0) newVal = 0;
            firePixels[index] = newVal;
          }
        }
      }

      // 2. 绘制
      ctx.clearRect(0, 0, width, height);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const val = firePixels[y * cols + x];
          if (val > 0) {
            const color = palette[val];
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
          }
        }
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
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        background: "#000",
      }}
    />
  );
}
