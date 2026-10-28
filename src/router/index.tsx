import NotFound from "@/pages/NotFound";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound></NotFound>,
  },
]);

export default router;

export const HOME_PATHNAME = "/";
