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
import MiniGame1 from "./MiniGame1";

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
        path: "/game/:gameId",
        element: <HostGame />,
      },
      {
        path: "/game/:gameId/play",
        element: <PlayGame />,
      },
      {
        path: "/minigame1",
        element: <MiniGame1 ready={true} />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
