import React, { FC, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Stack,
  IconButton,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useAuth } from "@quiz-platform/ui";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "@quiz-platform/ui";

interface LoginFormData {
  email: string;
  userName: string;
  password: string;
}

export const Login: FC<{ isRegistration: boolean }> = ({ isRegistration }) => {
  const navigate = useNavigate();
  const { login, isAuthenticated, initializing } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const [loginMutation, { loading: loginLoading }] =
    useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] =
    useMutation(REGISTER_MUTATION);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      userName: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (isRegistration) {
        const response = await registerMutation({
          variables: {
            input: {
              email: data.email,
              username: data.userName,
              password: data.password,
            },
          },
        });

        if (response.data?.register) {
          login(
            response.data.register.accessToken,
            response.data.register.user
          );
          toast.success("Регистрация успешна!");
          // allow auth state to propagate to other components before navigation
          navigate("/");
        }
      } else {
        const response = await loginMutation({
          variables: {
            input: {
              identifier: data.userName,
              password: data.password,
            },
          },
        });

        if (response.data?.login) {
          login(response.data.login.accessToken, response.data.login.user);
          toast.success("Вход выполнен!");
          // small delay to let auth subscribers update
          navigate("/");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Произошла ошибка");
      console.error("Error:", error);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {isRegistration ? "Регистрация" : "Авторизация"}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          {isRegistration && (
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email обязателен" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  fullWidth
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          )}

          <Controller
            name="userName"
            control={control}
            rules={{ required: "Username обязателен" }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label={isRegistration ? "Username" : "Email или Username"}
                error={!!errors.userName}
                helperText={errors.userName?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{ required: "Пароль обязателен" }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                fullWidth
                label="Пароль"
                type={showPassword ? "text" : "password"}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            )}
          />

          <Stack
            spacing={2}
            direction="row"
            justifyContent="space-between"
            mt={3}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loginLoading || registerLoading}
            >
              {isRegistration ? "Зарегистрироваться" : "Войти"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate(isRegistration ? "/login" : "/register")}
            >
              {isRegistration ? "Авторизация" : "Регистрация"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};
