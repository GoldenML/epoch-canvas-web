import { useRef, useEffect } from "react";

export default function Tetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0,
      height = 0;

    const cols = 10;
    const rows = 20;
    let blockSize = 20;
    let offsetX = 0,
      offsetY = 0;

    // ⭐ 核心修复 1：将 board 定义为 string[][]，用空字符串 '' 代表空位
    let board: string[][] = [];
    const colors = [
      "",
      "#38bdf8",
      "#c084fc",
      "#facc15",
      "#34d399",
      "#f87171",
      "#a78bfa",
      "#fb923c",
    ];

    const shapes = [
      [[1, 1, 1, 1]], // I
      [
        [1, 1],
        [1, 1],
      ], // O
      [
        [0, 1, 0],
        [1, 1, 1],
      ], // T
      [
        [1, 0, 0],
        [1, 1, 1],
      ], // L
      [
        [0, 0, 1],
        [1, 1, 1],
      ], // J
      [
        [0, 1, 1],
        [1, 1, 0],
      ], // S
      [
        [1, 1, 0],
        [0, 1, 1],
      ], // Z
    ];

    const currentPiece = { shape: [] as number[][], color: "", x: 0, y: 0 };
    let dropInterval = 500;
    let lastTime = 0;

    const initBoard = () => {
      // ⭐ 初始化为空字符串
      board = Array.from({ length: rows }, () => Array(cols).fill(""));
    };

    const newPiece = () => {
      const type = Math.floor(Math.random() * shapes.length);
      currentPiece.shape = shapes[type];
      currentPiece.color = colors[type + 1];
      currentPiece.x = Math.floor((cols - currentPiece.shape[0].length) / 2);
      currentPiece.y = 0;

      if (collide()) {
        initBoard(); // 如果顶到了，直接清空重来
      }
    };

    const collide = () => {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardX = currentPiece.x + x;
            const boardY = currentPiece.y + y;
            // ⭐ 核心修复 2：判断目标位置是否为空字符串
            if (
              boardX < 0 ||
              boardX >= cols ||
              boardY >= rows ||
              (boardY >= 0 && board[boardY][boardX] !== "")
            ) {
              return true;
            }
          }
        }
      }
      return false;
    };

    const merge = () => {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            // ⭐ 核心修复 3：类型已统一为 string，这里不再报错
            board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
          }
        });
      });
      newPiece();
    };

    const rotate = () => {
      const newShape = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map((row) => row[i]).reverse(),
      );
      const oldShape = currentPiece.shape;
      currentPiece.shape = newShape;
      if (collide()) currentPiece.shape = oldShape;
    };

    const move = (dir: number) => {
      currentPiece.x += dir;
      if (collide()) currentPiece.x -= dir;
    };

    const drop = () => {
      currentPiece.y++;
      if (collide()) {
        currentPiece.y--;
        merge();
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

        blockSize = Math.min(width / cols, height / rows);
        offsetX = (width - cols * blockSize) / 2;
        offsetY = (height - rows * blockSize) / 2;
      }
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    initBoard();
    newPiece();

    const draw = (time: number) => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      // 自动操作逻辑
      if (Math.random() < 0.02) move(Math.random() > 0.5 ? 1 : -1);
      if (Math.random() < 0.01) rotate();

      const deltaTime = time - lastTime;
      lastTime = time;

      if (deltaTime > dropInterval) {
        drop();
        // ⭐ 核心修复 4：判断非空元素，条件从 c !== 0 改为 c !== ''
        dropInterval = Math.max(
          100,
          500 - board.flat().filter((c) => c !== "").length * 2,
        );
        lastTime = 0;
      }

      // 清屏
      ctx.fillStyle = "#0d0d12";
      ctx.fillRect(0, 0, width, height);

      // 画网格
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(offsetX + i * blockSize, offsetY);
        ctx.lineTo(offsetX + i * blockSize, offsetY + rows * blockSize);
        ctx.stroke();
      }
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY + i * blockSize);
        ctx.lineTo(offsetX + cols * blockSize, offsetY + i * blockSize);
        ctx.stroke();
      }

      // 画已经固定的方块
      board.forEach((row, y) => {
        row.forEach((color, x) => {
          // ⭐ 核心修复 5：判断非空字符串
          if (color !== "") {
            ctx.fillStyle = color;
            ctx.fillRect(
              offsetX + x * blockSize,
              offsetY + y * blockSize,
              blockSize - 1,
              blockSize - 1,
            );
            // 高光
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.fillRect(
              offsetX + x * blockSize,
              offsetY + y * blockSize,
              blockSize - 1,
              4,
            );
          }
        });
      });

      // 画当前方块
      ctx.fillStyle = currentPiece.color;
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            ctx.fillRect(
              offsetX + (currentPiece.x + x) * blockSize,
              offsetY + (currentPiece.y + y) * blockSize,
              blockSize - 1,
              blockSize - 1,
            );
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.fillRect(
              offsetX + (currentPiece.x + x) * blockSize,
              offsetY + (currentPiece.y + y) * blockSize,
              blockSize - 1,
              4,
            );
            ctx.fillStyle = currentPiece.color;
          }
        });
      });

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
