import { FC, useEffect } from "react";
import { Box, Container } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useAuth, LoginForm } from "@quiz-platform/ui";
import { LOGIN_MUTATION } from "@quiz-platform/ui";

export const Login: FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, initializing } = useAuth();

  const [loginMutation, { loading: loginLoading }] =
    useMutation(LOGIN_MUTATION);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: { identifier: string; password: string }) => {
    try {
      const response = await loginMutation({
        variables: {
          input: { identifier: data.identifier, password: data.password },
        },
      });

      const payload = response.data?.login;
      if (payload) {
        // Only allow students to login via main web client
        if (payload.user?.role && payload.user.role !== "student") {
          toast.error("Этот аккаунт не может войти в основную часть сайта");
          return;
        }

        login(payload.accessToken, payload.user);
        toast.success("Вход выполнен!");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Произошла ошибка");
      console.error("Error:", error);
    }
  };

  if (initializing) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <LoginForm
        onSubmit={onSubmit}
        loading={loginLoading}
        title="Авторизация"
      />
    </Container>
  );
};
