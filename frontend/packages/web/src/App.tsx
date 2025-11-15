import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@quiz-platform/ui";
import { Login } from "./pages/Login";
import Profile from "./pages/Profile";
import { Courses } from "./pages/Courses";
import Creation from "./pages/Creation";
import Solution from "./pages/Solution";
import MainPanel from "./components/MainPanel";

export default function App() {
  const { isAuthenticated, logout, initializing } = useAuth();
  const [isFullPanel, setIsFullPanel] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        fontSize: 16,
        fontFamily: "Segoe UI",
        width: "100%",
      }}
    >
      <BrowserRouter>
        {initializing ? (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 8,
            }}
          >
            Проверка авторизации...
          </Box>
        ) : (
          <>
            {isAuthenticated && (
              <MainPanel
                setIsFullPanel={setIsFullPanel}
                isFullPanel={isFullPanel}
                logout={logout}
              />
            )}

            <Routes>
              {isAuthenticated ? (
                <>
                  <Route path="/" element={<Profile />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/creation" element={<Creation />} />
                  <Route path="/solution" element={<Solution />} />
                  <Route path="/solution/result" element={<Solution />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" replace />} />
              )}

              <Route path="/login" element={<Login isRegistration={false} />} />
              <Route
                path="/register"
                element={<Login isRegistration={true} />}
              />

              <Route
                path="*"
                element={
                  <Navigate to={isAuthenticated ? "/" : "/login"} replace />
                }
              />
            </Routes>
          </>
        )}
      </BrowserRouter>
      <ToastContainer position="top-right" />
    </Box>
  );
}
