import { useContext, Suspense, useState } from "react";
import { Box, ChakraProvider, HStack, theme } from "@chakra-ui/react";
import { Route, Navigate, Routes, BrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login";
import Profile from "./pages/Profile";
import { Courses } from "./pages/Courses";
import { Requests } from "./pages/Requests";
import Creation from "./pages/Creation";
import Solution from "./pages/Solution";
import { Students } from "./pages/Students";
import Moderation from "./pages/Moderation";
// import { cookies } from "./utils/api/apiUser";
import { QUIZ_TOKEN } from "./utils/common";
import MainPanel from "./components/MainPanel";
import { useUsers } from "./store/users";

export const App = () => {
  const { isLogged, clearUser } = useUsers();
  // const [isAuth, setIsAuth] = useState(!!cookies.get("access_token"));
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
          <Route
            path="/"
            element={isLogged ? <Profile /> : <Navigate to="/login" />}
          />

          <Route
            path={"/courses"}
            element={isLogged ? <Courses /> : <Navigate to="/login" />}
          />
          <Route
            path={"/requests"}
            element={isLogged ? <Requests /> : <Navigate to="/login" />}
          />
          <Route
            path={"/creation/info?/:subjectId?/:themeId?/"}
            element={isLogged ? <Creation /> : <Navigate to="/login" />}
          />
          <Route
            path={"/solution/:subjectId?/:themeId?/:testId?/result?"}
            element={isLogged ? <Solution /> : <Navigate to="/login" />}
          />
          <Route
            path={"/students"}
            element={isLogged ? <Students /> : <Navigate to="/login" />}
          />
          {/* <Route
            path={"/moderation"}
            element={
              isLogged && localStorage.getItem(QUIZ_TOKEN) == 123 ? (
                <Moderation />
              ) : (
                <Navigate to="/login" />
              )
            }
          /> */}

          <Route path="/login" element={<Login isRegistration={false} />} />
          <Route path="/register" element={<Login isRegistration={true} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
};
