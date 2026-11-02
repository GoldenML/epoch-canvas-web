# Epoch Canvas Gallery

> 一个用 React + TypeScript + 原生 Canvas 打造的 Web 动画画廊，收录 40 个可交互、可调参、可查看源码的视觉特效。

[![Online Demo](https://img.shields.io/badge/在线体验-canvas.epochyh.cn-38bdf8?style=flat-square)](https://canvas.epochyh.cn)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-6-1677ff?style=flat-square&logo=antdesign&logoColor=white)](https://ant.design)

**在线地址：<https://canvas.epochyh.cn>** —— 打开即可浏览，无需登录、无需安装。

---

## 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [使用说明](#使用说明)
- [动画清单](#动画清单)
- [新增一个动画](#新增一个动画)
- [项目结构](#项目结构)
- [实现要点](#实现要点)
- [环境变量](#环境变量)
- [构建与部署](#构建与部署)
- [常见问题](#常见问题)

---

## 项目简介

Epoch Canvas Gallery 是一个纯前端项目，所有动画都基于浏览器原生 `Canvas 2D API` 手写实现，**没有使用 Three.js、PixiJS 等图形库**。项目定位是「可运行的 Canvas 学习样本库」：既能直接欣赏效果，也能在详情页里逐行阅读、一键复制每个动画的完整源码。

适合三类人：

| 你是 | 可以拿它做什么 |
| --- | --- |
| 前端学习者 | 照着 40 个由浅入深的例子练 Canvas，从弹跳小球一路读到曼德勃罗集 |
| 视觉/交互设计师 | 找粒子、光效、赛博风格的灵感，调参后直接截图导出 |
| 开发者 | 拷贝单文件组件，把某个动画塞进自己的官网、大屏或落地页 |

## 功能特性

- **40 个动画，10 大分类** —— 物理、粒子、几何、光影、赛博、自然、数学、交互、游戏、复古。
- **实时预览而非录屏** —— 首页每张卡片都是真实运行的 Canvas，不是静态图或 GIF。
- **源码随行** —— 详情页右侧抽屉直接展示该动画的 TSX 源码，带行号高亮，支持一键复制。
- **参数可调** —— 部分动画（如「多球弹性碰撞」）提供悬浮控制面板，可实时调整重力与小球数量。
- **全屏与截图** —— 一键全屏沉浸观看，或把当前帧导出为 PNG。
- **搜索 + 分类筛选** —— 首页顶部输入关键词或切换 Tab，即时过滤。
- **滚动懒渲染** —— 卡片进入视口才启动动画，离开即销毁，40 个动画同页也不卡。
- **单卡错误隔离** —— 某个动画崩溃只影响自己那张卡片，不会带崩整页。
- **高清屏适配** —— 自动按 `devicePixelRatio` 设置画布分辨率，高分屏不模糊。

## 快速开始

### 环境要求

| 依赖 | 版本 |
| --- | --- |
| Node.js | ≥ 20.19（推荐 22 LTS） |
| pnpm | ≥ 9（项目使用 pnpm，含 `pnpm-lock.yaml`） |

> 使用 npm / yarn 也能跑，但依赖版本以 pnpm 锁文件为准，建议保持一致。

### 安装与启动

```bash
# 1. 克隆仓库
git clone https://github.com/GoldenML/epoch-canvas-web.git
cd epoch-canvas-web

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

终端会输出本地地址（默认 <http://localhost:5173>），浏览器打开即可。Vite 支持热更新，修改动画代码后画面会立即刷新。

### 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动开发服务器（HMR） |
| `pnpm build` | 类型检查 + 生产构建，产物输出到 `dist/` |
| `pnpm preview` | 本地预览构建产物，用于上线前自测 |
| `pnpm lint` | ESLint 检查 |

> `build` 会先执行 `tsc -b` 做全量类型检查，类型报错会直接中断构建。若只想快速看产物，可临时执行 `pnpm vite build`。

## 使用说明

### 首页：浏览与检索

打开首页会看到按网格排列的动画卡片，每张卡片封面都在实时播放。

- **搜索**：顶部搜索框支持按「标题」或「描述」模糊匹配，忽略大小写。例如输入 `分形`、`矩阵`、`3D`。
- **分类**：搜索框下方的 Tab 可切换分类（全部 / 物理 / 粒子 / 几何 / 光影 / 赛博 / 自然 / 数学 / 交互 / 游戏 / 复古），分类与搜索可叠加使用。
- **无结果**：筛选不到内容时显示空状态提示，清空搜索框即可恢复。
- **进入详情**：点击任意卡片，跳转到 `/detail/:id`。

### 详情页：观看、调参、读码

详情页是全屏黑色舞台，顶部工具栏从左到右依次是：

| 操作 | 说明 |
| --- | --- |
| **返回** | 回到首页 |
| **保存图片** | 把当前帧导出为 PNG，文件名即动画标题。动画在持续播放，多点几次可截到不同瞬间 |
| **全屏** | 让舞台区域进入浏览器全屏，Esc 退出 |
| **查看源码** | 右侧滑出 700px 宽代码抽屉，TypeScript 语法高亮 + 行号 |
| **一键复制** | 复制该动画完整源码到剪贴板，可直接粘贴进自己的项目 |

两个细节：

- 代码抽屉**没有遮罩**，可以一边看代码一边观察左侧动画，方便对照理解绘制逻辑。
- 只有「多球弹性碰撞」会在右下角出现**参数面板**：重力 `0 ~ 2G`、小球数量 `5 ~ 80`，拖动即时生效。其他动画暂未开放调参。

### 分享与直达

每个动画都有独立 URL，可直接分享给他人：

```
https://canvas.epochyh.cn/detail/matrix-rain
https://canvas.epochyh.cn/detail/mandelbrot
```

`id` 与动画的对应关系见下方[动画清单](#动画清单)。访问不存在的 `id` 会显示「动画不存在」，访问其他未知路径会进入 404 页并提示返回首页。

## 动画清单

共 40 个，按分类排列。表中的「路径」即详情页 URL 末段。

### 物理（4）

| 动画 | 路径 | 说明 |
| --- | --- | --- |
| 弹跳的小球 | `bouncing-ball` | 最基础的边界碰撞与速度反转，适合作为入门第一个例子 |
| 多球弹性碰撞 | `physics-balls` | 带重力、摩擦力与球球碰撞的物理沙盒，支持实时调参 |
| 钟摆波 | `pendulum-wave` | 用不同周期单摆的相位差排出一条流动的波 |
| 双摆混沌 | `double-pendulum` | 经典混沌系统，初始条件的微小差异会画出完全不同的轨迹 |

### 粒子（6）

| 动画 | 路径 | 说明 |
| --- | --- | --- |
| 粒子连线 | `particles` | 距离小于阈值即连线的经典效果 |
| 绚烂烟花 | `fireworks` | 含重力与空气阻力的爆炸粒子 |
| 流场噪声 | `flow-field` | 用噪声场推动粒子，形成丝绸般的拖尾 |
| 星空穿梭 | `starfield` | 透视投影 + 速度拉伸，营造 3D 纵深 |
| 布朗运动 | `brownian-motion` | 微观粒子的随机游走与动态网络 |
| 星系旋涡 | `galaxy` | 开普勒定律驱动的差速旋转星系 |

### 几何（8）

| 动画 | 路径 | 说明 |
| --- | --- | --- |
| 几何螺旋 | `geometric-spiral` | 极坐标旋转粒子 |
| 3D 线框立方体 | `wireframe-cube` | 纯 2D API 手写透视投影与旋转矩阵 |
| 分形三角形 | `sierpinski` | 混沌游戏算法生成谢尔宾斯基三角形 |
| 万花筒几何 | `kaleidoscope` | 极坐标镜像对称的花瓣结构 |
| 旋转魔法阵 | `magic-circle` | 多层多边形反向旋转叠加 |
| 伪音频频谱 | `oscilloscope` | 多重正弦叠加的发光波形，模拟示波器 |
| 3D DNA 螺旋 | `dna-helix` | sin/cos 计算的双螺旋与碱基连线 |
| 3D 线框地形 | `wireframe-terrain` | 正弦叠加地形 + 复古透视网格 |

### 光影（7）

| 动画 | 路径 | 说明 |
| --- | --- | --- |
| 正弦波浪 | `waves` | 平滑流动的多层波形线 |
| 液态流动 | `liquid-blobs` | 多重正弦调制的液体质感色块 |
| 极光光影 | `aurora` | 流体光带，适合做背景 |
| 黑洞引力 | `black-hole` | 粒子向奇点加速并绕行 |
| 水波涟漪 | `ripples` | 径向渐变扩散的同心波纹 |
| 生命游戏 | `game-of-life` | 康威生命游戏，零玩家自动演化 |
| 等离子火焰 | `plasma-fire` | 多重径向渐变的炽热光晕 |

### 赛博（5）

| 动画 | 路径 | 说明 |
| --- | --- | --- |
| 矩阵雨 | `matrix-rain` | 黑客帝国数字雨 |
| 赛博故障 | `cyber-glitch` | RGB 分离 + 像素错位的故障艺术 |
| 赛博透视网格 | `cyber-grid` | Synthwave 风格无限地平线 |
| 相控阵雷达 | `radar` | 扫描扇区 + 目标点追踪的 HUD 模拟 |
| 3D 环形频谱 | `data-rings` | 透视投影下的旋转数据环 |

### 自然（3）

| 动画 | 路径 | 说明 |
| --- | --- | --- |
| 雷电交加 | `thunderstorm` | 暴雨 + 分支闪电 + 全屏爆闪 |
| 萤火虫之光 | `fireflies` | 呼吸光晕的随机漫步光点 |
| 分形树 | `fractal-tree` | 递归树枝 + 微风摆动 |

### 数学（3）

| 动画 | 路径 | 说明 |
| --- | --- | --- |
| 曼德勃罗集 | `mandelbrot` | 复平面迭代，无限放大分形 |
| 洛伦兹吸引子 | `lorenz` | 蝴蝶效应的三维投影 |
| 繁花曲线 | `spirograph` | 内摆线公式绘制的几何轨迹 |

### 交互 / 游戏 / 复古（4）

| 动画 | 路径 | 分类 | 说明 |
| --- | --- | --- | --- |
| 粒子交互文字 | `particle-text` | 交互 | 鼠标产生斥力与引力，把粒子推开再吸回字形 |
| 群体智能鸟群 | `boids` | 交互 | 分离 / 对齐 / 聚合三法则的人工生命 |
| 自动俄罗斯方块 | `tetris` | 游戏 | 完整碰撞与旋转逻辑的 AI 自动对局 |
| 像素火焰 | `pixel-fire` | 复古 | 8 位游戏经典的火焰传播算法 |

## 新增一个动画

整个流程只有两步：**写组件 → 注册**。

### 第 1 步：创建组件

新建 `src/animations/MyEffect/index.tsx`。所有动画都遵循同一套骨架：占满父容器、监听尺寸、按 DPR 缩放、用 `requestAnimationFrame` 驱动、卸载时清理。

```tsx
import { useRef, useEffect } from "react";

export default function MyEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let width = 0;
    let height = 0;

    // 尺寸变化时同步画布分辨率，避免拉伸模糊
    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      const dpr = window.devicePixelRatio || 1;
      width = w;
      height = h;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // 之后按 CSS 像素绘制
    });
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // ↓↓↓ 在这里写你的绘制逻辑 ↓↓↓
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 40, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}
```

### 第 2 步：注册到动画列表

编辑 `src/animations/index.ts`，需要加三处：

```ts
// ① 导入组件本体
import MyEffect from "./MyEffect";
// ② 用 ?raw 把源码当字符串导入（详情页展示用）
import MyEffectCode from "./MyEffect/index.tsx?raw";

export const animations = [
  // ...已有动画
  {
    id: "my-effect",        // URL 唯一标识，建议 kebab-case，不要重复
    title: "我的特效",       // 卡片标题
    description: "一句话说明它是什么",  // 卡片描述，也会被搜索命中
    category: "粒子",        // 必须是 categories 里已有的分类
    component: MyEffect,
    code: MyEffectCode,
  },
];
```

保存后首页立刻出现新卡片，详情页 `/detail/my-effect` 也能正常打开并展示源码。

### 说明与注意事项

- **新分类**：如果 `category` 用了全新名字，记得同步加到 `src/animations/index.ts` 顶部的 `categories` 数组，否则 Tab 里点不到。
- **纯 CSS 尺寸**：`canvas` 的样式必须是 `width/height: 100%`，父容器决定实际大小；不要写死像素宽高。
- **必须清理**：`ResizeObserver.disconnect()` 和 `cancelAnimationFrame()` 缺一不可，否则离开页面后定时器仍在跑，越浏览越卡。
- **不要引用外部图片**：一旦画布绘制了跨域资源，详情页的「保存图片」(`toDataURL`) 会抛安全错误。所有图形请用 Canvas API 现画。
- **可选缩略图**：`AnimationMeta` 预留了 `thumbnail?: string`，当前版本未使用（首页一律实时渲染），需要静态封面时可自行接入。
- **支持外部参数**：如果想让动画响应详情页的控制面板，参照 `PhysicsBalls` 声明可选 props 并给默认值：

```tsx
interface Props {
  gravity?: number;
  ballCount?: number;
}

export default function PhysicsBalls({ gravity = 0.5, ballCount = 20 }: Props) {
  // 在 useEffect 依赖里带上参数，即可在滑块变化时重建场景
}
```

详情页会把 `gravity` / `ballCount` 传给所有动画组件，不声明 props 的组件会自动忽略，无需改动。

## 项目结构

```
epoch-canvas-web/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── animations/              # 40 个动画，一个目录一个动画
│   │   ├── BouncingBall/index.tsx
│   │   ├── PhysicsBalls/index.tsx
│   │   ├── ...                  # 其余 38 个
│   │   └── index.ts             # ⭐ 动画注册表 + 分类定义
│   ├── api/
│   │   ├── http.ts              # axios 实例、Token 注入、401 跳转
│   │   └── user.ts              # 用户信息 / 登出接口
│   ├── components/
│   │   ├── ErrorBoundary.tsx    # 单个动画崩溃兜底
│   │   └── LazyCanvasWrapper.tsx# 视口内才渲染动画
│   ├── pages/
│   │   ├── Home/index.tsx       # 首页：搜索 + 分类 + 卡片网格
│   │   ├── Home/index.module.scss
│   │   ├── Detail/index.tsx     # 详情页：全屏 / 截图 / 源码 / 调参
│   │   └── NotFound.tsx         # 404
│   ├── router/index.tsx         # 路由表
│   ├── store/useUserStore.ts    # zustand 用户状态
│   ├── types/index.ts           # AnimationMeta 等类型
│   ├── App.tsx                  # 暗色主题 + RouterProvider
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts               # @ / @components / @api 等路径别名
├── package.json
└── pnpm-lock.yaml
```

路径别名在 `vite.config.ts` 中定义，源码里可以直接 `import x from "@/components/ErrorBoundary"`。

## 实现要点

想改造项目时，这几处设计值得先了解：

| 机制 | 位置 | 作用 |
| --- | --- | --- |
| 源码即数据 | `animations/index.ts` 的 `?raw` 导入 | Vite 把 `.tsx` 原文当字符串打包，详情页无需额外文件即可展示与复制 |
| 懒渲染 | `components/LazyCanvasWrapper.tsx` | `IntersectionObserver` 监听视口，`rootMargin: 100px` 提前加载；离开视口直接卸载子树，停掉 rAF |
| 错误隔离 | `components/ErrorBoundary.tsx` | 每个卡片独立包裹，某个动画抛错只显示「动画加载失败」 |
| 高清适配 | 各动画内的 `ResizeObserver` | 画布物理像素 = CSS 像素 × DPR，并用 `setTransform` 归一化坐标 |
| 注册表驱动 | `animations/index.ts` | 首页、详情页、搜索、分类全部从同一份数组推导，加动画不用改页面 |
| 暗色主题 | `App.tsx` | antd `theme.darkAlgorithm`，组件库与手写样式统一深色 |

## 环境变量

项目内置了对接统一认证中心的能力（`src/api/http.ts`、`src/store/useUserStore.ts`），通过环境变量配置：

| 变量 | 说明 | 示例 |
| --- | --- | --- |
| `VITE_AUTH_HOST` | 认证中心地址，401 时跳转到 `${VITE_AUTH_HOST}login?appId=...&redirect=...` | `https://epochyh.cn/#/` |
| `VITE_APP_ID` | 在认证中心注册的应用标识 | `canvas` |

文件：`.env.development`（开发）、`.env.production`（生产）。改完需重启 dev server 才生效。

> **当前线上版本不需要登录**。认证相关代码是预置能力，页面尚未接入登录入口；不配置这两个变量也能正常浏览全部动画。若要启用登录，在需要的页面调用 `useUserStore().fetchUserInfo()`，并在网关侧把 `/api` 代理到认证中心。

## 构建与部署

### 构建

```bash
pnpm install
pnpm build      # 产物在 dist/
pnpm preview    # 本地验证，默认 http://localhost:4173
```

`dist/` 是纯静态文件，可放到任意静态服务器、CDN 或对象存储。

### Nginx 示例（推荐）

项目使用 `createBrowserRouter`（HTML5 History 模式），**必须配置 SPA 回退**，否则直接访问 `/detail/matrix-rain` 或刷新详情页会 404。

```nginx
server {
    listen 80;
    server_name canvas.epochyh.cn;

    root /var/www/canvas-web/dist;
    index index.html;

    # 前端路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 带 hash 的静态资源长期缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # index.html 不缓存，保证发版后立刻生效
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;
}
```

配好后 `nginx -t && nginx -s reload`。若同时要代理后端接口，再加一段 `location /api/ { proxy_pass ... }`。

### 其他平台

- **Vercel / Netlify**：构建命令 `pnpm build`，输出目录 `dist`；SPA 回退在 Vercel 默认生效，Netlify 需加 `/* /index.html 200` 重写规则。
- **对象存储（OSS/COS）**：静态托管开启「默认首页 `index.html`」，并配置 404 回退到 `index.html`。
- **子路径部署**（如 `https://example.com/canvas/`）：在 `vite.config.ts` 增加 `base: "/canvas/"`，同时路由 basename 也要一起改。

线上实例：<https://canvas.epochyh.cn>

## 常见问题

**Q：首页有卡片是黑的？**
动画采用懒渲染，卡片接近视口才启动。若长时间全黑，检查浏览器是否支持 `IntersectionObserver`（现代浏览器均支持），或打开控制台看是否有报错。单个动画崩溃时卡片会显示「动画加载失败」，不影响其他卡片。

**Q：点「保存图片」没反应 / 报错？**
截图依赖 `canvas.toDataURL()`。若该画布绘制过跨域资源，浏览器会以「画布被污染」为由拒绝导出。本项目动画均为纯代码绘制，正常不会触发；自行新增动画时请勿贴外部图片。

**Q：刷新详情页 404？**
服务器缺少 SPA 回退配置，参照上方 Nginx 的 `try_files ... /index.html`。

**Q：`pnpm build` 报 TypeScript 错误？**
构建会执行 `tsc -b` 全量类型检查。按报错修类型即可；`PhysicsBalls` 的 props 是可选的，但详情页会无条件传入 `gravity`/`ballCount`，新增组件若不接收 props 不受影响。

**Q：页面滚动卡顿？**
同时可见的动画越多负载越高。可减少单屏卡片数量（调整 `Home/index.tsx` 中 `Col` 的 `xs/sm/md/lg` 断点），或降低画布 DPR 上限（把 `window.devicePixelRatio` 改为 `Math.min(window.devicePixelRatio, 2)`）。

**Q：为什么有些动画没有调参面板？**
参数面板目前只对 `physics-balls` 开放（见 `Detail/index.tsx` 的 `hasControls`）。其他动画可按同样方式扩展：声明 props → 加 `Slider` → 传入组件。

---

如果这个项目对你有帮助，欢迎 Star 支持一下。所有动画均为教学示例，欢迎参考与二次创作。
