import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useQuery, useMutation } from "@apollo/client";
import {
  SUBJECTS_QUERY,
  THEMES_BY_SUBJECT_QUERY,
  TESTS_LIST_QUERY,
  USERS_QUERY,
} from "@quiz-platform/ui/src/graphql/queries";
import {
  CREATE_SUBJECT_MUTATION,
  ADD_SUBJECT_MATERIAL_MUTATION,
  DELETE_SUBJECT_MATERIAL_MUTATION,
  DELETE_SUBJECT_MUTATION,
  DELETE_THEME_MUTATION,
  DELETE_TEST_MUTATION,
} from "@quiz-platform/ui/src/graphql/mutations";
import { useAuth } from "@quiz-platform/ui";

const SubjectsPage: React.FC = () => {
  const { user } = useAuth() as any;
  const { data, loading, refetch } = useQuery(SUBJECTS_QUERY as any);
  const { data: usersData } = useQuery(USERS_QUERY as any);

  const [createSubject] = useMutation(CREATE_SUBJECT_MUTATION as any, {
    onCompleted: () => refetch(),
  });

  const [addSubjectMaterial] = useMutation(
    ADD_SUBJECT_MATERIAL_MUTATION as any,
    {
      onCompleted: () => refetch(),
    }
  );

  const [deleteSubjectMaterial] = useMutation(
    DELETE_SUBJECT_MATERIAL_MUTATION as any,
    {
      onCompleted: () => refetch(),
    }
  );

  const [deleteSubject] = useMutation(DELETE_SUBJECT_MUTATION as any, {
    onCompleted: () => refetch(),
  });

  const [deleteTheme] = useMutation(DELETE_THEME_MUTATION as any, {
    onCompleted: () => refetch(),
  });

  const [deleteTest] = useMutation(DELETE_TEST_MUTATION as any, {
    onCompleted: () => refetch(),
  });

  const [name, setName] = React.useState("");
  const [selectedTeacher, setSelectedTeacher] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    if (user?.role === "teacher") setSelectedTeacher(user.id);
  }, [user]);

  const subjects = data?.subjects || [];
  const users = usersData?.users || [];
  const teachers = users.filter((u: any) => u.role === "teacher");

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await createSubject({
        variables: {
          nameSubject: name,
          expertId: selectedTeacher ?? undefined,
        },
      });
      setName("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSubject = async (id: number) => {
    try {
      await deleteSubject({ variables: { id } });
    } catch (e) {
      console.error(e);
    }
  };

  const addMaterial = async (
    subjectId: number,
    url: string,
    title?: string
  ) => {
    try {
      await addSubjectMaterial({ variables: { subjectId, url, title } });
    } catch (e) {
      console.error(e);
    }
  };

  const removeMaterial = async (matId: number) => {
    try {
      await deleteSubjectMaterial({ variables: { id: matId } });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Модерация предметов
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <TextField
          label="Название предмета"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {user?.role === "admin" && (
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="teacher-select-label">Преподаватель</InputLabel>
            <Select
              labelId="teacher-select-label"
              value={selectedTeacher ?? ""}
              label="Преподаватель"
              onChange={(e) =>
                setSelectedTeacher(Number(e.target.value) || null)
              }
            >
              <MenuItem value="">— Не выбран —</MenuItem>
              {teachers.map((t: any) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.lastName || ""} {t.firstName || ""} ({t.username})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Создать
        </Button>
      </Stack>

      <Box>
        {loading ? (
          <Typography>Загрузка...</Typography>
        ) : (
          subjects.map((s: any) => (
            <Accordion key={s.id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ flex: 1 }}>{s.nameSubject}</Typography>
                <IconButton
                  onClick={() => handleDeleteSubject(s.id)}
                  size="small"
                  aria-label="delete-subject"
                >
                  <DeleteIcon />
                </IconButton>
              </AccordionSummary>

              <AccordionDetails>
                {/* Materials */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Учебные материалы
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box mb={2}>
                      <AddMaterialForm subjectId={s.id} onAdd={addMaterial} />
                    </Box>
                    <Box>
                      {(s.subjectMaterials || []).map((m: any) => (
                        <Box
                          key={m.id}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={1}
                        >
                          <a href={m.url} target="_blank" rel="noreferrer">
                            {m.title || m.url}
                          </a>
                          <IconButton
                            size="small"
                            onClick={() => removeMaterial(m.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                      {(!s.subjectMaterials ||
                        s.subjectMaterials.length === 0) && (
                        <Typography>Материалы отсутствуют</Typography>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {/* Themes */}
                <Accordion sx={{ mt: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Темы
                  </AccordionSummary>
                  <AccordionDetails>
                    <ThemesList
                      subjectId={s.id}
                      users={users}
                      parentRefetch={refetch}
                    />
                  </AccordionDetails>
                </Accordion>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>
    </Box>
  );
};

const AddMaterialForm: React.FC<{
  subjectId: number;
  onAdd: (sid: number, url: string, title?: string) => void;
}> = ({ subjectId, onAdd }) => {
  const [url, setUrl] = React.useState("");
  const [title, setTitle] = React.useState("");

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <TextField
        label="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        size="small"
      />
      <TextField
        label="Ссылка"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        size="small"
        sx={{ minWidth: 320 }}
      />
      <Button
        variant="outlined"
        onClick={() => {
          if (!url) return;
          onAdd(subjectId, url, title || url);
          setUrl("");
          setTitle("");
        }}
      >
        Добавить
      </Button>
    </Stack>
  );
};

const ThemesList: React.FC<{
  subjectId: number;
  users: any[];
  parentRefetch?: () => void;
}> = ({ subjectId, users, parentRefetch }) => {
  const { data, loading } = useQuery(THEMES_BY_SUBJECT_QUERY as any, {
    variables: { subjectId },
  });
  const themes = data?.themesBySubject || [];

  const [deleteThemeMutation] = useMutation(DELETE_THEME_MUTATION as any, {
    onCompleted: () => {
      if (parentRefetch) parentRefetch();
    },
  });

  return (
    <Box>
      {loading ? (
        <Typography>Загрузка...</Typography>
      ) : themes.length === 0 ? (
        <Typography>Темы отсутствуют</Typography>
      ) : (
        themes.map((t: any) => (
          <Accordion key={t.id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ flex: 1 }}>{t.nameTheme}</Typography>
              <IconButton
                size="small"
                onClick={async () => {
                  try {
                    await deleteThemeMutation({ variables: { id: t.id } });
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </AccordionSummary>
            <AccordionDetails>
              <TestsTable
                subjectId={subjectId}
                themeId={t.id}
                users={users}
                parentRefetch={parentRefetch}
              />
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

const TestsTable: React.FC<{
  subjectId: number;
  themeId: number;
  users: any[];
  parentRefetch?: () => void;
}> = ({ subjectId, themeId, users, parentRefetch }) => {
  const { data, loading, refetch } = useQuery(TESTS_LIST_QUERY as any, {
    variables: { subjectId, themeId },
  });
  const tests = data?.testsBySubjectAndTheme || [];

  const [deleteTestMutation] = useMutation(DELETE_TEST_MUTATION as any, {
    onCompleted: async () => {
      await refetch();
      if (parentRefetch) parentRefetch();
    },
  });

  const handleDeleteTest = async (testId: number) => {
    try {
      await deleteTestMutation({ variables: { id: testId } });
    } catch (e) {
      console.error(e);
    }
  };

  const usersMap = React.useMemo(() => {
    const m: Record<number, any> = {};
    (users || []).forEach((u: any) => (m[u.id] = u));
    return m;
  }, [users]);

  return (
    <Box>
      {loading ? (
        <Typography>Загрузка тестов...</Typography>
      ) : tests.length === 0 ? (
        <Typography>Тесты отсутствуют</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ФИО</TableCell>
              <TableCell>Логин</TableCell>
              <TableCell>Прохождений</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map((t: any) => {
              const author = usersMap[t.authorId];
              return (
                <TableRow key={t.id}>
                  <TableCell>
                    {author
                      ? `${author.lastName || ""} ${author.firstName || ""}`
                      : ""}
                  </TableCell>
                  <TableCell>{author ? author.username : t.authorId}</TableCell>
                  <TableCell>{t.timesSolved ?? 0}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteTest(t.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default SubjectsPage;
