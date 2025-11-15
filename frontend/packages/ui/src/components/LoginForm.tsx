import React from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

export interface LoginFormData {
  identifier: string;
  password: string;
}

interface Props {
  onSubmit: (data: LoginFormData) => Promise<void> | void;
  loading?: boolean;
  title?: string;
}

const LoginForm: React.FC<Props> = ({ onSubmit, loading, title }) => {
  const { control, handleSubmit } = useForm<LoginFormData>({
    defaultValues: { identifier: "", password: "" },
  });

  return (
    <Box sx={{ mt: 4, maxWidth: 420, mx: "auto" }}>
      <Typography component="h1" variant="h5" textAlign="center">
        {title ?? "Авторизация"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
        <Controller
          name="identifier"
          control={control}
          rules={{ required: "Email или Username обязателен" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Email или Username"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{ required: "Пароль обязателен" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Пароль"
              type="password"
              fullWidth
              margin="normal"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          Войти
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
