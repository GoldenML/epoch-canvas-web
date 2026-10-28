import { useRef, useEffect } from "react";

export default function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;
    let cols = 0,
      rows = 0;
    const resolution = 10; // 细胞大小
    let grid: number[][] = [];

    const initGrid = () => {
      cols = Math.floor(width / resolution);
      rows = Math.floor(height / resolution);
      grid = Array.from({ length: cols }, () =>
        Array.from({ length: rows }, () => (Math.random() > 0.8 ? 1 : 0)),
      );
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initGrid();
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const countNeighbors = (x: number, y: number) => {
      let sum = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          const col = (x + i + cols) % cols;
          const row = (y + j + rows) % rows;
          sum += grid[col][row];
        }
      }
      sum -= grid[x][y];
      return sum;
    };

    let lastTime = 0;

    const draw = (time: number) => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // 控制演算速度，大约每 100ms 更新一次网格
      if (time - lastTime > 100) {
        lastTime = time;

        // 计算下一代
        const nextGrid = grid.map((arr) => [...arr]);
        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            const state = grid[x][y];
            const neighbors = countNeighbors(x, y);

            if (state === 0 && neighbors === 3) nextGrid[x][y] = 1;
            else if (state === 1 && (neighbors < 2 || neighbors > 3))
              nextGrid[x][y] = 0;
          }
        }
        grid = nextGrid;

        // 绘制
        ctx.fillStyle = "#0d0d12";
        ctx.fillRect(0, 0, width, height);

        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            if (grid[x][y] === 1) {
              ctx.fillStyle = "#34d399"; // 荧光绿
              ctx.fillRect(
                x * resolution,
                y * resolution,
                resolution - 1,
                resolution - 1,
              );
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

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
