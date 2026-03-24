import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { CHANGE_PASSWORD_MUTATION } from "../graphql/mutations";

const validateComplexity = (p: string) =>
  /^(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(p);

const ChangePasswordAccordion: React.FC<{ maxWidth?: number | string }> = ({
  maxWidth,
}) => {
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD_MUTATION, {
    onCompleted: () => {
      setSuccess("Пароль успешно изменён");
      setError(null);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err) => {
      setError(err?.message || "Ошибка при изменении пароля");
      setSuccess(null);
    },
  });

  const canSubmit = () => {
    return (
      oldPassword.length > 0 &&
      newPassword.length > 0 &&
      confirmPassword.length > 0 &&
      newPassword === confirmPassword &&
      validateComplexity(newPassword)
    );
  };

  return (
    <Box sx={{ mt: 2, maxWidth: maxWidth ?? 400 }}>
      <Accordion>
        <AccordionSummary>
          <Typography>Изменить пароль</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <TextField
              label="Старый пароль"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              size="small"
            />
            <TextField
              label="Новый пароль"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              size="small"
              helperText={
                newPassword && !validateComplexity(newPassword)
                  ? "Пароль должен содержать 8 символов, как минимум одну цифру и один спецсимвол"
                  : ""
              }
              error={!!(newPassword && !validateComplexity(newPassword))}
            />
            <TextField
              label="Повторите новый пароль"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="small"
              helperText={
                confirmPassword && newPassword !== confirmPassword
                  ? "Пароли не совпадают"
                  : ""
              }
              error={!!(confirmPassword && newPassword !== confirmPassword)}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Button
                variant="contained"
                disabled={!canSubmit() || loading}
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                  if (newPassword !== confirmPassword) {
                    setError("Пароли не совпадают");
                    return;
                  }
                  if (!validateComplexity(newPassword)) {
                    setError(
                      "Пароль должен содержать 8 символов, как минимум одну цифру и один спецсимвол",
                    );
                    return;
                  }
                  changePassword({ variables: { oldPassword, newPassword } });
                }}
              >
                Изменить
              </Button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ChangePasswordAccordion;
