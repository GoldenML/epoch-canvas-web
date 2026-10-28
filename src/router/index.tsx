import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Detail from "@/pages/Detail";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/detail/:id", // ⭐ 添加动态路由参数 id
    element: <Detail />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
export const HOME_PATHNAME = "/";
