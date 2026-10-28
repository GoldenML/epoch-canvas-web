import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./router";
import { ConfigProvider, theme } from "antd";

function App() {
  return (
    <>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <RouterProvider router={router}></RouterProvider>
      </ConfigProvider>
    </>
  );
}

export default App;
