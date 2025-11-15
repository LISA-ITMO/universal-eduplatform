import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import {
  SUBJECTS_QUERY,
  THEMES_BY_SUBJECT_QUERY,
  TESTS_LIST_QUERY,
  CREATE_SUBJECT_MUTATION,
  CREATE_THEME_MUTATION,
} from "@quiz-platform/ui";
import { useAuth } from "@quiz-platform/ui";
import CreateForm from "./CreateForm";

interface SelectCourseProps {
  path: string;
  goToText: string;
  isSolution?: boolean;
  onSelect?: (subjectId: string, themeId: string, testId?: string) => void;
}

const SelectCourse = ({
  path,
  goToText,
  isSolution = false,
  onSelect,
}: SelectCourseProps) => {
  const [subject, setSubject] = useState("");
  const [theme, setTheme] = useState("");
  const [test, setTest] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCreateTheme, setIsCreateTheme] = useState(false);
  const [isCreateSubject, setIsCreateSubject] = useState(false);

  const { data: subjectsData, refetch: refetchSubjects } =
    useQuery(SUBJECTS_QUERY);
  const { data: themesData, refetch: refetchThemes } = useQuery(
    THEMES_BY_SUBJECT_QUERY,
    {
      variables: { subjectId: parseInt(subject) },
      skip: !subject,
    }
  );
  const { data: testsData } = useQuery(TESTS_LIST_QUERY, {
    variables: {
      subjectId: parseInt(subject),
      themeId: parseInt(theme),
    },
    skip: !isSolution || !subject || !theme,
  });

  const [createSubject] = useMutation(CREATE_SUBJECT_MUTATION);
  const [createTheme] = useMutation(CREATE_THEME_MUTATION);

  const subjects = subjectsData?.subjects || [];
  const themes = themesData?.themesBySubject || [];
  const tests =
    testsData?.testsBySubjectAndTheme?.filter(
      (t: any) => t.authorId !== user?.id
    ) || [];

  const handleCreateSubject = async (name: string) => {
    try {
      await createSubject({ variables: { nameSubject: name } });
      await refetchSubjects();
      setIsCreateSubject(false);
      toast.success("Предмет создан");
    } catch (error: any) {
      toast.error("Ошибка создания предмета");
      console.error(error);
    }
  };

  const handleCreateTheme = async (name: string) => {
    try {
      await createTheme({
        variables: { nameTheme: name, subjectId: parseInt(subject) },
      });
      await refetchThemes();
      setIsCreateTheme(false);
      toast.success("Тема создана");
    } catch (error: any) {
      toast.error("Ошибка создания темы");
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSelect) {
      onSelect(subject, theme, test);
      return;
    }

    const url = isSolution
      ? `/${path}/${subject}/${theme}/${test}`
      : `/${path}/${subject}/${theme}`;
    navigate(url);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: 5 }}
    >
      <Box sx={{ textAlign: "center", pt: 3, fontSize: 18, fontWeight: 600 }}>
        Выбор предмета и темы
      </Box>
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Предмет</InputLabel>
        <Select
          value={subject}
          onChange={(e: SelectChangeEvent) => setSubject(e.target.value)}
        >
          {subjects.map((item: any) => (
            <MenuItem key={item.id} value={item.id.toString()}>
              {item.nameSubject}
            </MenuItem>
          ))}
        </Select>
        {!isSolution && (
          <CreateForm
            setState={setIsCreateSubject}
            state={isCreateSubject}
            refreshFunc={refetchSubjects}
            asyncFunc={handleCreateSubject}
          />
        )}
      </FormControl>

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Тема</InputLabel>
        <Select
          value={theme}
          onChange={(e: SelectChangeEvent) => setTheme(e.target.value)}
        >
          {themes.map((item: any) => (
            <MenuItem key={item.id} value={item.id.toString()}>
              {item.nameTheme}
            </MenuItem>
          ))}
        </Select>
        {!isSolution && subject && (
          <CreateForm
            setState={setIsCreateTheme}
            state={isCreateTheme}
            refreshFunc={refetchThemes}
            asyncFunc={handleCreateTheme}
          />
        )}
      </FormControl>

      {isSolution && (
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Тест</InputLabel>
          <Select
            value={test}
            onChange={(e: SelectChangeEvent) => setTest(e.target.value)}
          >
            {tests.map((item: any) => (
              <MenuItem key={item.id} value={item.id.toString()}>
                id: {item.id}, автор: {item.authorId}, решено {item.timesSolved}{" "}
                раз
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        disabled={!subject || !theme || (isSolution && !test)}
      >
        {goToText}
      </Button>
    </Box>
  );
};

export default SelectCourse;
