import { useState } from "react";
import { Route, Navigate, Routes, BrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login";
import Profile from "./pages/Profile";
import { Courses } from "./pages/Courses";
import { Requests } from "./pages/Requests";
import Creation from "./pages/Creation";
import Solution from "./pages/Solution";
import { Students } from "./pages/Students";
import MainPanel from "./components/MainPanel";
import { useUsers } from "./store/users";
import { useUsersAuthentication } from "./hooks/useUserAuthentication";
import { Box } from "@mui/material";
import { ToastContainer } from "react-toastify";

export const App = () => {
  const { isLogged, clearUser } = useUsers();
  const [isFullPanel, setIsFullPanel] = useState(true);
  useUsersAuthentication();

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
        {isLogged && (
          <MainPanel
            setIsFullPanel={setIsFullPanel}
            isFullPanel={isFullPanel}
            logout={() => {
              clearUser();
            }}
          />
        )}

        <Routes>
          {/* Защищенные маршруты */}
          {isLogged ? (
            <>
              <Route path="/" element={<Profile />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/requests" element={<Requests />} />
              <Route
                path="/creation/info?/:subjectId?/:themeId?"
                element={<Creation />}
              />
              <Route
                path="/solution/:subjectId?/:themeId?/:testId?/result?"
                element={<Solution />}
              />
              <Route path="/students" element={<Students />} />
            </>
          ) : (
            // Если пользователь не авторизован, перенаправляем на /login
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}

          {/* Публичные маршруты */}
          <Route path="/login" element={<Login isRegistration={false} />} />
          <Route path="/register" element={<Login isRegistration={true} />} />

          {/* Редирект для несуществующих маршрутов */}
          <Route
            path="*"
            element={<Navigate to={isLogged ? "/" : "/login"} replace />}
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Box>
  );
};
