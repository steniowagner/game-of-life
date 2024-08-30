import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BoardSetupContextProvider } from "./contexts";
import { App } from "./App.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BoardSetupContextProvider>
      <App />
    </BoardSetupContextProvider>
  </StrictMode>
);
