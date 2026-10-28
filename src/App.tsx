/*
 * @Author: GoldenML wayy180304@gmail.com
 * @Date: 2026-10-14 17:57:58
 * @LastEditors: GoldenML wayy180304@gmail.com
 * @LastEditTime: 2026-10-14 18:00:12
 * @Description:
 * @FilePath: \resource-website\src\App.tsx
 */
import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./router";

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
