import { useState, useMemo } from "react";
import { Card, Row, Col, Typography, Input, Tabs, Empty } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { animations, categories } from "@/animations"; // ⭐ 引入 categories
import ErrorBoundary from "@/components/ErrorBoundary";
import LazyCanvasWrapper from "@/components/LazyCanvasWrapper";
import styles from "./index.module.scss";

const { Title, Text } = Typography;

export default function Home() {
  const navigate = useNavigate();

  // ⭐ 状态管理：搜索词和当前分类
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");

  // ⭐ 过滤逻辑：根据分类和搜索词动态计算要显示的动画
  const filteredAnimations = useMemo(() => {
    return animations.filter((anim) => {
      // 1. 检查分类是否匹配
      const matchCategory =
        activeCategory === "全部" || anim.category === activeCategory;
      // 2. 检查搜索词是否匹配 (忽略大小写，搜索标题或描述)
      const searchLower = searchText.toLowerCase();
      const matchSearch =
        anim.title.toLowerCase().includes(searchLower) ||
        anim.description.toLowerCase().includes(searchLower);

      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchText]);

  return (
    <div className={styles["home-container"]}>
      <div className={styles["header-section"]}>
        <Title level={1} className={styles["main-title"]}>
          Epoch Canvas Gallery
        </Title>
        <Text className={styles["sub-title"]}>
          探索极致绚丽的 Web Canvas 交互体验
        </Text>

        {/* ⭐ 搜索与分类控制栏 */}
        <div className={styles["control-panel"]}>
          <Input
            size="large"
            placeholder="搜索动画名称或描述..."
            prefix={<SearchOutlined style={{ color: "#64748b" }} />}
            className={styles["search-input"]}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <Tabs
            centered
            activeKey={activeCategory}
            onChange={(key) => setActiveCategory(key)}
            className={styles["category-tabs"]}
            items={categories.map((cat) => ({
              key: cat,
              label: cat,
            }))}
          />
        </div>
      </div>

      {/* 渲染卡片网格 */}
      {filteredAnimations.length > 0 ? (
        <div>
          <Row gutter={[24, 24]}>
            {filteredAnimations.map((anim) => {
              const AnimationComponent = anim.component;
              return (
                <Col xs={24} sm={12} md={8} lg={6} key={anim.id}>
                  <Card
                    hoverable
                    className={styles["canvas-card"]}
                    onClick={() => navigate(`/detail/${anim.id}`)}
                    cover={
                      <div className={styles["card-cover"]}>
                        <ErrorBoundary>
                          <LazyCanvasWrapper>
                            <AnimationComponent />
                          </LazyCanvasWrapper>
                        </ErrorBoundary>
                      </div>
                    }
                  >
                    <Card.Meta
                      title={
                        <span style={{ color: "#e2e8f0", fontSize: "18px" }}>
                          {anim.title}
                        </span>
                      }
                      description={
                        <span style={{ color: "#94a3b8" }}>
                          {anim.description}
                        </span>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* ⭐ 添加页脚 */}
          <footer
            style={{
              marginTop: 80,
              padding: "40px 0 20px",
              textAlign: "center",
              borderTop: "1px solid rgba(255, 255, 255, 0.05)",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            <p>
              © {new Date().getFullYear()} Epoch Canvas Gallery. Built with
              React & Canvas.
            </p>
            <p style={{ marginTop: 8 }}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#38bdf8", marginRight: 16 }}
              >
                GitHub
              </a>
              <a href="#" style={{ color: "#38bdf8" }}>
                关于作者
              </a>
            </p>
          </footer>
        </div>
      ) : (
        // ⭐ 空状态：搜索不到结果时显示
        <div className={styles["empty-state"]}>
          <Empty
            description="没有找到匹配的动画"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      )}
    </div>
  );
}
