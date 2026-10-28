// src/components/ErrorBoundary.tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("动画渲染崩溃:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#1a1a1a",
              color: "#888",
              flexDirection: "column",
            }}
          >
            <span>⚠️</span>
            <span style={{ fontSize: 12, marginTop: 8 }}>动画加载失败</span>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
