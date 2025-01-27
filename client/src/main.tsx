import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./context/UserProvider.tsx";
import { NotificationProvider } from "./context/NotificationProvider.tsx";
import { SocketProvider } from "./context/SocketProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
        <UserProvider>
          <NotificationProvider>
      <SocketProvider>
            <App />
      </SocketProvider>
          </NotificationProvider>
        </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
