import { useRef, useEffect } from "react";

export default function Mandelbrot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
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

      time += 0.01;
      // 缓慢缩放和平移
      const zoom = 1.5 + Math.sin(time * 0.5) * 0.5;
      const offsetX = -0.5 + Math.cos(time * 0.2) * 0.1;
      const offsetY = 0 + Math.sin(time * 0.2) * 0.1;

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      const maxIterations = 100; // 迭代次数

      // 为了性能，我们隔行扫描/降采样渲染
      const step = 2;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          // 将屏幕坐标映射到复数平面
          const cr = (x / width - 0.5) * zoom + offsetX;
          const ci = (y / height - 0.5) * zoom + offsetY;

          let zr = 0,
            zi = 0;
          let iterations = 0;

          while (zr * zr + zi * zi < 4 && iterations < maxIterations) {
            const temp = zr * zr - zi * zi + cr;
            zi = 2 * zr * zi + ci;
            zr = temp;
            iterations++;
          }

          if (iterations < maxIterations) {
            // 颜色映射
            const hue = (iterations / maxIterations) * 360;
            const rgb = hslToRgb(hue / 360, 1, 0.5);

            // 填充 step x step 的块
            for (let dy = 0; dy < step; dy++) {
              for (let dx = 0; dx < step; dx++) {
                const px = (y + dy) * width + (x + dx);
                const index = px * 4;
                if (px < data.length / 4) {
                  data[index] = rgb[0];
                  data[index + 1] = rgb[1];
                  data[index + 2] = rgb[2];
                  data[index + 3] = 255;
                }
              }
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      animationFrameId = requestAnimationFrame(draw);
    };

    // 辅助函数：HSL转RGB
    function hslToRgb(h: number, s: number, l: number) {
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

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
