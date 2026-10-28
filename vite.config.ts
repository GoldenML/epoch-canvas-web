import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 推荐使用 path.resolve 或 fileURLToPath 来保证跨平台的绝对路径
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@router": path.resolve(__dirname, "./src/router"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },
});
