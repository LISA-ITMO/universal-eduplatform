import { Avatar, Box, TextField } from "@mui/material";
import { useUsers } from "../store/users";
import { FC } from "react";

export const ProfileCard: FC = () => {
  const user = useUsers((state) => state.user);

  return (
    <Box sx={{ my: 5, mx: 3, maxWidth: "900px" }}>
      <Box sx={{ border: "1px solid black", borderRadius: 1 }}>
        <Box sx={{ textAlign: "center", pt: 1, pb: 3 }}>
          <Box sx={{ fontSize: 22, fontWeight: "600" }}>
            Профиль пользователя
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", alignItems: "center", fontSize: 18, pl: 2 }}
        >
          <Box>
            <Avatar alt={user?.username} sx={{ width: 70, height: 70 }}>
              {user?.username[0] || "U"}
            </Avatar>
          </Box>
          <Box sx={{ pl: 3 }}>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ fontWeight: "600" }}>ID пользователя:</Box>
              <Box sx={{ whiteSpace: "pre" }}>
                {` ${user?.id}` || " Нет значения"}
              </Box>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ fontWeight: "600" }}>Роль пользователя:</Box>
              <Box sx={{ whiteSpace: "pre" }}>
                {` ${user?.role}` || " Нет значения"}
              </Box>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Box sx={{ fontWeight: "600" }}>Логин:</Box>
              <Box sx={{ whiteSpace: "pre" }}>
                {` ${user?.username}` || " Нет значения"}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ pl: 2, py: 3, pr: 10 }}>
          <Box sx={{ py: 0.5 }}>
            <Box sx={{ fontWeight: "600" }}>Фамилия</Box>
            <TextField
              name="lastname"
              defaultValue="Lastname"
              variant="standard"
              size="small"
              sx={{ width: "50%", minWidth: "200px" }}
              disabled
            />
          </Box>
          <Box sx={{ py: 0.5 }}>
            <Box sx={{ fontWeight: "600" }}>Имя</Box>
            <TextField
              name="firstname"
              defaultValue="Firstname"
              variant="standard"
              size="small"
              sx={{ width: "50%", minWidth: "200px" }}
              disabled
            />
          </Box>
          <Box sx={{ py: 0.5 }}>
            <Box sx={{ fontWeight: "600" }}>Отчество</Box>
            <TextField
              name="patronymic"
              defaultValue="Patronymic"
              variant="standard"
              size="small"
              sx={{ width: "50%", minWidth: "200px" }}
              disabled
            />
          </Box>
          <Box>
            <Box sx={{ fontWeight: "600" }}>Электронная почта</Box>
            <TextField
              name="email"
              variant="standard"
              defaultValue={user?.email || "Нет значения"}
              size="small"
              sx={{ width: "50%", minWidth: "200px" }}
              disabled
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
