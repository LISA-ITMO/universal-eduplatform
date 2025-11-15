import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress,
  Alert,
  Stack,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TableSortLabel,
} from "@mui/material";
import { useQuery, useMutation } from "@apollo/client";
import { USERS_PAGED_QUERY, CREATE_USER_MUTATION } from "@quiz-platform/ui";
import { useAuth } from "@quiz-platform/ui";

const PAGE_SIZE = 10;

const UsersPage: React.FC = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    username: "",
    password: "",
    role: "student",
  });

  const [createUser, { loading: creating, error: createError }] =
    useMutation(CREATE_USER_MUTATION);

  const [search, setSearch] = useState("");

  const [visibleCols, setVisibleCols] = useState({
    lastName: true,
    firstName: true,
    middleName: true,
    username: true,
    email: true,
    phone: true,
    role: true,
    lastLogin: true,
  });

  const [sortState, setSortState] = useState<{
    field: string | null;
    direction: "asc" | "desc" | null;
  }>({
    field: null,
    direction: null,
  });

  const { data, loading, error, refetch } = useQuery(USERS_PAGED_QUERY, {
    variables: {
      skip: page * PAGE_SIZE,
      take: PAGE_SIZE,
      search,
      orderByField: sortState.field,
      orderByDirection: sortState.direction,
    },
    fetchPolicy: "network-only",
  });

  const rows = data?.usersPage?.items ?? [];
  const totalCount = data?.usersPage?.totalCount ?? 0;

  // rows are provided by server; search and sort are applied server-side via query variables

  const allowedRoles =
    user?.role === "teacher" ? ["student"] : ["student", "teacher"];

  const handleChange = (key: string) => (e: any) =>
    setForm({ ...form, [key]: e.target.value });

  const handleCreate = async () => {
    if (!form.lastName || !form.firstName || !form.username || !form.password)
      return;
    try {
      await createUser({ variables: { input: { ...form, role: form.role } } });
      setForm({
        lastName: "",
        firstName: "",
        middleName: "",
        username: "",
        password: "",
        role: "student",
      });
      // refetch current page with current params
      await refetch({
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE,
        search,
        orderByField: sortState.field,
        orderByDirection: sortState.direction,
      });
    } catch (e) {
      // handled by createError
    }
  };

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const toggleColumn = (col: string) => (_: any, checked: boolean) => {
    setVisibleCols((s) => ({ ...s, [col]: checked }));
  };

  const toggleSort = (field: string) => () => {
    setSortState((s) => {
      if (s.field !== field) {
        setPage(0);
        return { field, direction: "asc" };
      }
      if (s.direction === "asc") {
        setPage(0);
        return { field, direction: "desc" };
      }
      setPage(0);
      return { field: null, direction: null };
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Пользователи
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Создать пользователя</Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 2 }}
        >
          <TextField
            label="Фамилия"
            value={form.lastName}
            onChange={handleChange("lastName")}
            required
          />
          <TextField
            label="Имя"
            value={form.firstName}
            onChange={handleChange("firstName")}
            required
          />
          <TextField
            label="Отчество"
            value={form.middleName}
            onChange={handleChange("middleName")}
          />
          <TextField
            label="Логин"
            value={form.username}
            onChange={handleChange("username")}
            required
          />
          <TextField
            label="Пароль"
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            required
          />
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="role-label">Роль</InputLabel>
            <Select
              labelId="role-label"
              value={form.role}
              label="Роль"
              onChange={handleChange("role")}
            >
              {allowedRoles.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="contained"
              onClick={handleCreate}
              disabled={creating}
            >
              {creating ? <CircularProgress size={20} /> : "Создать"}
            </Button>
          </Box>
        </Stack>
        {createError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {(createError as any).message}
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Список пользователей</Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 2, mb: 1 }}
          alignItems="center"
        >
          <TextField
            label="Поиск"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ minWidth: 240 }}
          />
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={visibleCols.lastName}
                  onChange={toggleColumn("lastName")}
                />
              }
              label="Фамилия"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={visibleCols.firstName}
                  onChange={toggleColumn("firstName")}
                />
              }
              label="Имя"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={visibleCols.username}
                  onChange={toggleColumn("username")}
                />
              }
              label="Логин"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={visibleCols.email}
                  onChange={toggleColumn("email")}
                />
              }
              label="Почта"
            />
          </FormGroup>
        </Stack>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">
            Ошибка загрузки: {(error as any).message}
          </Alert>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  {visibleCols.lastName && (
                    <TableCell
                      sortDirection={
                        sortState.field === "lastName" && sortState.direction
                          ? (sortState.direction as "asc" | "desc")
                          : false
                      }
                    >
                      <TableSortLabel
                        active={sortState.field === "lastName"}
                        direction={
                          (sortState.direction as "asc" | "desc") ?? "asc"
                        }
                        onClick={toggleSort("lastName")}
                      >
                        Фамилия
                      </TableSortLabel>
                    </TableCell>
                  )}
                  {visibleCols.firstName && (
                    <TableCell
                      sortDirection={
                        sortState.field === "firstName" && sortState.direction
                          ? (sortState.direction as "asc" | "desc")
                          : false
                      }
                    >
                      <TableSortLabel
                        active={sortState.field === "firstName"}
                        direction={
                          (sortState.direction as "asc" | "desc") ?? "asc"
                        }
                        onClick={toggleSort("firstName")}
                      >
                        Имя
                      </TableSortLabel>
                    </TableCell>
                  )}
                  {visibleCols.middleName && <TableCell>Отчество</TableCell>}
                  {visibleCols.username && (
                    <TableCell
                      sortDirection={
                        sortState.field === "username" && sortState.direction
                          ? (sortState.direction as "asc" | "desc")
                          : false
                      }
                    >
                      <TableSortLabel
                        active={sortState.field === "username"}
                        direction={
                          (sortState.direction as "asc" | "desc") ?? "asc"
                        }
                        onClick={toggleSort("username")}
                      >
                        Логин
                      </TableSortLabel>
                    </TableCell>
                  )}
                  {visibleCols.email && <TableCell>Почта</TableCell>}
                  {visibleCols.phone && <TableCell>Телефон</TableCell>}
                  {visibleCols.role && <TableCell>Роль</TableCell>}
                  {visibleCols.lastLogin && (
                    <TableCell>Последний вход</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r: any) => (
                  <TableRow key={r.id}>
                    {visibleCols.lastName && (
                      <TableCell>{r.lastName}</TableCell>
                    )}
                    {visibleCols.firstName && (
                      <TableCell>{r.firstName}</TableCell>
                    )}
                    {visibleCols.middleName && (
                      <TableCell>{r.middleName}</TableCell>
                    )}
                    {visibleCols.username && (
                      <TableCell>{r.username}</TableCell>
                    )}
                    {visibleCols.email && <TableCell>{r.email}</TableCell>}
                    {visibleCols.phone && <TableCell>{r.phone}</TableCell>}
                    {visibleCols.role && <TableCell>{r.role}</TableCell>}
                    {visibleCols.lastLogin && (
                      <TableCell>
                        {r.lastLogin
                          ? new Date(r.lastLogin).toLocaleString()
                          : "-"}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={PAGE_SIZE}
              rowsPerPageOptions={[PAGE_SIZE]}
              labelDisplayedRows={({ from, to }) => `${from}-${to}`}
            />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default UsersPage;
