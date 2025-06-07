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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { API_USER, cookies } from "../utils/api/apiUser";
import { useUsers } from "../store/users";
import { Bounce, toast } from "react-toastify";

export const Login: FC<{ isRegistration: boolean }> = ({ isRegistration }) => {
  const navigate = useNavigate();
  const { setUser, isLogged } = useUsers();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      userName: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isLogged) navigate("/");
  }, [isLogged]);

  const onSubmit = async (data: any) => {
    try {
      if (isRegistration) {
        const response = await API_USER.register({
          email: data.email,
          username: data.userName,
          password: data.password,
        });
        if (response) {
          toast.success("Пользователь успешно добавлен в систему", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          navigate("/login");
        }
      } else {
        const response = await API_USER.login({
          username: data.userName,
          password: data.password,
        });
        if (response) {
          toast.success("Пользователь успешно авторизован", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          setUser(response?.data[0]);
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(
        isRegistration ? "Ошибка регистрации" : "Ошибка авторизации",
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
      console.error("Error:", error);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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
                label="Username"
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
            <Button type="submit" fullWidth variant="contained" color="primary">
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
