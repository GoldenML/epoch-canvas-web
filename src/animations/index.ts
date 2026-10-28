import BouncingBall from "./BouncingBall";
import BouncingBallCode from "./BouncingBall/index.tsx?raw";
import Particles from "./Particles";
import ParticlesCode from "./Particles/index.tsx?raw";
import Waves from "./Waves";
import WavesCode from "./Waves/index.tsx?raw";
import Starfield from "./Starfield";
import StarfieldCode from "./Starfield/index.tsx?raw";
import MatrixRain from "./MatrixRain";
import MatrixRainCode from "./MatrixRain/index.tsx?raw";
import GeometricSpiral from "./GeometricSpiral";
import GeometricSpiralCode from "./GeometricSpiral/index.tsx?raw";
import LiquidBlobs from "./LiquidBlobs";
import LiquidBlobsCode from "./LiquidBlobs/index.tsx?raw";
import Fireworks from "./Fireworks";
import FireworksCode from "./Fireworks/index.tsx?raw";
import FlowField from "./FlowField";
import FlowFieldCode from "./FlowField/index.tsx?raw";
import CyberGlitch from "./CyberGlitch";
import CyberGlitchCode from "./CyberGlitch/index.tsx?raw";
import WireframeCube from "./WireframeCube";
import WireframeCubeCode from "./WireframeCube/index.tsx?raw";
import Sierpinski from "./Sierpinski";
import SierpinskiCode from "./Sierpinski/index.tsx?raw";
import Aurora from "./Aurora";
import AuroraCode from "./Aurora/index.tsx?raw";
import BlackHole from "./BlackHole";
import BlackHoleCode from "./BlackHole/index.tsx?raw";
import Ripples from "./Ripples";
import RipplesCode from "./Ripples/index.tsx?raw";
import GameOfLife from "./GameOfLife";
import GameOfLifeCode from "./GameOfLife/index.tsx?raw";
import Kaleidoscope from "./Kaleidoscope";
import KaleidoscopeCode from "./Kaleidoscope/index.tsx?raw";
import Oscilloscope from "./Oscilloscope";
import OscilloscopeCode from "./Oscilloscope/index.tsx?raw";
import MagicCircle from "./MagicCircle";
import MagicCircleCode from "./MagicCircle/index.tsx?raw";
import PhysicsBalls from "./PhysicsBalls";
import PhysicsBallsCode from "./PhysicsBalls/index.tsx?raw";
import PendulumWave from "./PendulumWave";
import PendulumWaveCode from "./PendulumWave/index.tsx?raw";
import DNAHelix from "./DNAHelix";
import DNAHelixCode from "./DNAHelix/index.tsx?raw";
import BrownianMotion from "./BrownianMotion";
import BrownianMotionCode from "./BrownianMotion/index.tsx?raw";
import PlasmaFire from "./PlasmaFire";
import PlasmaFireCode from "./PlasmaFire/index.tsx?raw";
import Thunderstorm from "./Thunderstorm";
import ThunderstormCode from "./Thunderstorm/index.tsx?raw";
import Mandelbrot from "./Mandelbrot";
import MandelbrotCode from "./Mandelbrot/index.tsx?raw";
import Lorenz from "./Lorenz";
import LorenzCode from "./Lorenz/index.tsx?raw";
import Galaxy from "./Galaxy";
import GalaxyCode from "./Galaxy/index.tsx?raw";
import CyberGrid from "./CyberGrid";
import CyberGridCode from "./CyberGrid/index.tsx?raw";
import ParticleText from "./ParticleText";
import ParticleTextCode from "./ParticleText/index.tsx?raw";
import Boids from "./Boids";
import BoidsCode from "./Boids/index.tsx?raw";
import WireframeTerrain from "./WireframeTerrain";
import WireframeTerrainCode from "./WireframeTerrain/index.tsx?raw";
import Radar from "./Radar";
import RadarCode from "./Radar/index.tsx?raw";
import Tetris from "./Tetris";
import TetrisCode from "./Tetris/index.tsx?raw";
import Fireflies from "./Fireflies";
import FirefliesCode from "./Fireflies/index.tsx?raw";
import FractalTree from "./FractalTree";
import FractalTreeCode from "./FractalTree/index.tsx?raw";
import Spirograph from "./Spirograph";
import SpirographCode from "./Spirograph/index.tsx?raw";
import DataRings from "./DataRings";
import DataRingsCode from "./DataRings/index.tsx?raw";
import DoublePendulum from "./DoublePendulum";
import DoublePendulumCode from "./DoublePendulum/index.tsx?raw";
import PixelFire from "./PixelFire";
import PixelFireCode from "./PixelFire/index.tsx?raw";

// ⭐ 导出所有分类，方便首页动态渲染 Tab
export const categories = [
  "全部",
  "物理",
  "粒子",
  "几何",
  "光影",
  "赛博",
  "自然",
  "数学",
  "交互",
  "游戏",
  "复古",
];

export const animations = [
  {
    id: "bouncing-ball",
    title: "弹跳的小球",
    description: "一个简单的物理弹跳动画",
    category: "物理",
    component: BouncingBall,
    code: BouncingBallCode,
  },
  {
    id: "physics-balls",
    title: "多球弹性碰撞",
    description: "带有重力、摩擦力和碰撞检测的物理沙盒",
    category: "物理",
    component: PhysicsBalls,
    code: PhysicsBallsCode,
  },

  {
    id: "particles",
    title: "粒子连线",
    description: "经典的粒子相吸与连线效果",
    category: "粒子",
    component: Particles,
    code: ParticlesCode,
  },
  {
    id: "fireworks",
    title: "绚烂烟花",
    description: "包含重力和空气阻力的物理粒子",
    category: "粒子",
    component: Fireworks,
    code: FireworksCode,
  },
  {
    id: "flow-field",
    title: "流场噪声",
    description: "基于数学流场的粒子拖尾效果",
    category: "粒子",
    component: FlowField,
    code: FlowFieldCode,
  },
  {
    id: "starfield",
    title: "星空穿梭",
    description: "3D 纵深感穿越星空特效",
    category: "粒子",
    component: Starfield,
    code: StarfieldCode,
  },

  {
    id: "geometric-spiral",
    title: "几何螺旋",
    description: "极坐标系下旋转的炫彩粒子",
    category: "几何",
    component: GeometricSpiral,
    code: GeometricSpiralCode,
  },
  {
    id: "wireframe-cube",
    title: "3D 线框立方体",
    description: "纯 2D Canvas 计算的 3D 透视投影",
    category: "几何",
    component: WireframeCube,
    code: WireframeCubeCode,
  },
  {
    id: "sierpinski",
    title: "分形三角形",
    description: "基于混沌游戏算法的分形几何",
    category: "几何",
    component: Sierpinski,
    code: SierpinskiCode,
  },
  {
    id: "kaleidoscope",
    title: "万花筒几何",
    description: "极坐标系下的对称旋转花瓣",
    category: "几何",
    component: Kaleidoscope,
    code: KaleidoscopeCode,
  },
  {
    id: "magic-circle",
    title: "旋转魔法阵",
    description: "多层多边形反向旋转的奇幻阵图",
    category: "几何",
    component: MagicCircle,
    code: MagicCircleCode,
  },
  {
    id: "oscilloscope",
    title: "伪音频频谱",
    description: "多重波形叠加的发光音频特效",
    category: "几何",
    component: Oscilloscope,
    code: OscilloscopeCode,
  },

  {
    id: "waves",
    title: "正弦波浪",
    description: "平滑流动的波形线条",
    category: "光影",
    component: Waves,
    code: WavesCode,
  },
  {
    id: "liquid-blobs",
    title: "液态流动",
    description: "多重正弦波叠加的液体质感",
    category: "光影",
    component: LiquidBlobs,
    code: LiquidBlobsCode,
  },
  {
    id: "aurora",
    title: "极光光影",
    description: "多重正弦波叠加的流体光影",
    category: "光影",
    component: Aurora,
    code: AuroraCode,
  },
  {
    id: "black-hole",
    title: "黑洞引力",
    description: "粒子围绕奇点的极坐标加速运动",
    category: "光影",
    component: BlackHole,
    code: BlackHoleCode,
  },
  {
    id: "ripples",
    title: "水波涟漪",
    description: "基于径向渐变的波纹扩散效果",
    category: "光影",
    component: Ripples,
    code: RipplesCode,
  },
  {
    id: "game-of-life",
    title: "生命游戏",
    description: "康威生命游戏，零玩家自动演化",
    category: "光影",
    component: GameOfLife,
    code: GameOfLifeCode,
  },

  {
    id: "matrix-rain",
    title: "矩阵雨",
    description: "经典黑客帝国数字下落特效",
    category: "赛博",
    component: MatrixRain,
    code: MatrixRainCode,
  },
  {
    id: "cyber-glitch",
    title: "赛博故障",
    description: "RGB 分离与像素错位的故障艺术",
    category: "赛博",
    component: CyberGlitch,
    code: CyberGlitchCode,
  },
  {
    id: "pendulum-wave",
    title: "钟摆波",
    description: "单摆简谐运动产生的波浪视觉",
    category: "物理",
    component: PendulumWave,
    code: PendulumWaveCode,
  },
  {
    id: "dna-helix",
    title: "3D DNA 螺旋",
    description: "利用正弦余弦计算的 3D 双螺旋",
    category: "几何",
    component: DNAHelix,
    code: DNAHelixCode,
  },
  {
    id: "brownian-motion",
    title: "布朗运动",
    description: "微观粒子的随机游走与网络连接",
    category: "粒子",
    component: BrownianMotion,
    code: BrownianMotionCode,
  },
  {
    id: "plasma-fire",
    title: "等离子火焰",
    description: "多重径向渐变的炽热发光效果",
    category: "光影",
    component: PlasmaFire,
    code: PlasmaFireCode,
  },
  {
    id: "thunderstorm",
    title: "雷电交加",
    description: "暴雨与随机闪电的模拟",
    category: "自然",
    component: Thunderstorm,
    code: ThunderstormCode,
  },
  {
    id: "mandelbrot",
    title: "曼德勃罗集",
    description: "无限放大的复数分形几何",
    category: "数学",
    component: Mandelbrot,
    code: MandelbrotCode,
  },
  {
    id: "lorenz",
    title: "洛伦兹吸引子",
    description: "混沌理论与蝴蝶效应的可视化",
    category: "数学",
    component: Lorenz,
    code: LorenzCode,
  },
  {
    id: "galaxy",
    title: "星系旋涡",
    description: "开普勒定律驱动的银河系旋转",
    category: "粒子",
    component: Galaxy,
    code: GalaxyCode,
  },
  {
    id: "cyber-grid",
    title: "赛博透视网格",
    description: "经典 Synthwave 风格无限空间",
    category: "赛博",
    component: CyberGrid,
    code: CyberGridCode,
  },
  {
    id: "particle-text",
    title: "粒子交互文字",
    description: "鼠标排斥与引力构成的文字阵列",
    category: "交互",
    component: ParticleText,
    code: ParticleTextCode,
  },
  {
    id: "boids",
    title: "群体智能鸟群",
    description: "三大法则驱动的人工生命粒子",
    category: "交互",
    component: Boids,
    code: BoidsCode,
  },
  {
    id: "wireframe-terrain",
    title: "3D 线框地形",
    description: "正弦波叠加生成的复古透视山脉",
    category: "几何",
    component: WireframeTerrain,
    code: WireframeTerrainCode,
  },
  {
    id: "radar",
    title: "相控阵雷达",
    description: "带扫描扇区和目标追踪的 UI 模拟",
    category: "赛博",
    component: Radar,
    code: RadarCode,
  },
  {
    id: "tetris",
    title: "自动俄罗斯方块",
    description: "带完整碰撞与旋转逻辑的 AI 游戏演示",
    category: "游戏",
    component: Tetris,
    code: TetrisCode,
  },
  {
    id: "fireflies",
    title: "萤火虫之光",
    description: "带有呼吸光晕的随机漫步粒子",
    category: "自然",
    component: Fireflies,
    code: FirefliesCode,
  },
  {
    id: "fractal-tree",
    title: "分形树",
    description: "递归算法生成的动态微风树枝",
    category: "自然",
    component: FractalTree,
    code: FractalTreeCode,
  },
  {
    id: "spirograph",
    title: "繁花曲线",
    description: "内摆线数学公式的绝美几何轨迹",
    category: "数学",
    component: Spirograph,
    code: SpirographCode,
  },
  {
    id: "data-rings",
    title: "3D 环形频谱",
    description: "透视投影下的旋转数据可视化",
    category: "赛博",
    component: DataRings,
    code: DataRingsCode,
  },
  {
    id: "double-pendulum",
    title: "双摆混沌",
    description: "经典混沌物理系统的轨迹可视化",
    category: "物理",
    component: DoublePendulum,
    code: DoublePendulumCode,
  },
  {
    id: "pixel-fire",
    title: "像素火焰",
    description: "经典的 8 位游戏火焰传播算法",
    category: "复古",
    component: PixelFire,
    code: PixelFireCode,
  },
];
