import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BoardSetupContextProvider } from "./contexts";
import { Game } from "./components/game/Game";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BoardSetupContextProvider>
      <Game />
    </BoardSetupContextProvider>
  </StrictMode>
);
