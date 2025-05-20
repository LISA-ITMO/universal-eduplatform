import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./i18n";
import { UserProvider } from "./providers/UserProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
