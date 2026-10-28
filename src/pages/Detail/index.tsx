import { useParams, useNavigate } from "react-router-dom";
import { animations } from "@/animations";
import { Button, Drawer, message, Tooltip, Slider } from "antd"; // ⭐ 引入 Slider
import { useState, useRef } from "react";
import {
  ArrowLeftOutlined,
  FullscreenOutlined,
  CodeOutlined,
  CopyOutlined,
  DownloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const anim = animations.find((a) => a.id === id);
  const [codeVisible, setCodeVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ⭐ 控制面板状态 (针对 PhysicsBalls)
  const [gravity, setGravity] = useState(0.5);
  const [ballCount, setBallCount] = useState(20);
  // 是否显示控制面板
  const [showControls] = useState(true);

  if (!anim)
    return (
      <div style={{ color: "#fff", textAlign: "center", marginTop: 100 }}>
        动画不存在
      </div>
    );

  const AnimationComponent = anim.component;

  // 只有特定的动画才显示控制面板
  const hasControls = anim.id === "physics-balls";

  // 全屏逻辑
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current
        ?.requestFullscreen()
        .catch(() => message.error(`全屏失败`));
    } else {
      document.exitFullscreen();
    }
  };

  // ... 复制和保存图片的代码保持不变 ...
  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(anim.code);
    message.success("代码已复制");
  };
  const handleDownloadImage = () => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${anim.title}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#0d0d12",
      }}
    >
      {/* 顶部工具栏 */}
      <div
        style={{
          padding: "16px 24px",
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/")}
            style={{ color: "#fff" }}
          >
            返回
          </Button>
          <h2 style={{ margin: 0, color: "#e2e8f0", fontWeight: 600 }}>
            {anim.title}
          </h2>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Tooltip title="保存当前画面为图片">
            <Button icon={<DownloadOutlined />} onClick={handleDownloadImage}>
              保存图片
            </Button>
          </Tooltip>
          <Tooltip title="全屏展示">
            <Button icon={<FullscreenOutlined />} onClick={toggleFullScreen}>
              全屏
            </Button>
          </Tooltip>
          <Button
            type="primary"
            icon={<CodeOutlined />}
            onClick={() => setCodeVisible(true)}
          >
            查看源码
          </Button>
        </div>
      </div>

      {/* Canvas 舞台 */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          background: "#000",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* ⭐ 5. 将参数传递给你的动画组件 */}
        <AnimationComponent gravity={gravity} ballCount={ballCount} />
      </div>

      {/* ⭐ 6. 悬浮控制面板 */}
      {hasControls && showControls && (
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            width: 300,
            background: "rgba(20, 20, 25, 0.85)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            zIndex: 5,
            color: "#e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20,
            }}
          >
            <SettingOutlined style={{ color: "#38bdf8" }} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>动画参数调节</span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#94a3b8",
                marginBottom: 8,
              }}
            >
              <span>重力大小 (Gravity)</span>
              <span>{gravity.toFixed(1)}</span>
            </div>
            <Slider
              min={0}
              max={2}
              step={0.1}
              value={gravity}
              onChange={setGravity}
              tooltip={{ formatter: (value) => `${value}G` }}
            />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 13,
                color: "#94a3b8",
                marginBottom: 8,
              }}
            >
              <span>小球数量 (Count)</span>
              <span>{ballCount}</span>
            </div>
            <Slider
              min={5}
              max={80}
              step={1}
              value={ballCount}
              onChange={setBallCount}
            />
          </div>
        </div>
      )}

      {/* 代码抽屉 (去掉遮罩) */}
      <Drawer
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingRight: 20,
            }}
          >
            <span style={{ color: "#e2e8f0" }}>{anim.title} - 源码</span>
            <Button
              size="small"
              type="primary"
              icon={<CopyOutlined />}
              onClick={handleCopyCode}
            >
              一键复制
            </Button>
          </div>
        }
        placement="right"
        width={700}
        onClose={() => setCodeVisible(false)}
        open={codeVisible}
        mask={false}
        maskClosable={false} // ⭐ 去掉遮罩，可以边看边玩
        styles={{
          body: { padding: 0, background: "#282c34" },
          header: { background: "#1e1e1e", borderBottom: "1px solid #333" },
        }}
      >
        <SyntaxHighlighter
          language="typescript"
          style={atomOneDark}
          showLineNumbers
          customStyle={{ margin: 0, minHeight: "100%", padding: "24px" }}
        >
          {anim.code}
        </SyntaxHighlighter>
      </Drawer>
    </div>
  );
}
