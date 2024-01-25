import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import "./index.css";
import ErrorPage from "./error-page";
import Home from "./routes/Home";
import About from "./routes/About";
import HostGame from "./routes/HostGame";
import PlayGame from "./routes/PlayGame";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/game/host/:gameId",
        element: <HostGame />,
      },
      {
        path: "/game/play/:gameId",
        element: <PlayGame/>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
