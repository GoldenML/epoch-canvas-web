// src/components/LazyCanvasWrapper.tsx
import { useRef, useEffect, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function LazyCanvasWrapper({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 当元素进入视口时，设为 true；离开视口时，设为 false (销毁动画)
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "100px" }, // 提前 100px 开始加载
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", background: "#000" }}
    >
      {/* 如果在视口内，才渲染子组件（Canvas 动画） */}
      {isVisible ? children : null}
    </div>
  );
}
