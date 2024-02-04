import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import "./index.css";
import "./App.css";
import ErrorPage from "./error-page";
import Home from "./routes/Home";
import Demos from "./routes/Demos";
import About from "./routes/About";
import HostGame from "./routes/HostGame";
import PlayGame from "./routes/PlayGame";
import MiniGame1 from "./MiniGame1";
import { GatherWordsProvider } from "./contexts/GatherWordsContext";

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
        path: "/demos",
        element: <Demos />,
      },
      {
        path: "/game/:gameId",
        element: <HostGame />,
      },
      {
        path: "/game/:gameId/play",
        element: (
          <GatherWordsProvider>
            <PlayGame />
          </GatherWordsProvider>
        ),
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
