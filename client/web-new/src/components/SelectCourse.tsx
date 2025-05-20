import { useEffect, useState } from "react";
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
import CreateForm from "./CreateForm";
import { API_SUBJECTS } from "../utils/api/apiSubjects";
import { API_TESTS } from "../utils/api/apiTests";
import { useUsers } from "../store/users";

const SelectCourse = ({ path, goToText, isSolution }) => {
  const [subject, setSubject] = useState("");
  const [theme, setTheme] = useState("");
  const [test, setTest] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [themes, setThemes] = useState([]);
  const [tests, setTests] = useState([]);

  const { user } = useUsers();
  const navigate = useNavigate();

  const [isCreateTheme, setIsCreateTheme] = useState(false);
  const [isCreateSubject, setIsCreateSubject] = useState(false);

  useEffect(() => {
    loadSubjectList();
  }, []);

  useEffect(() => {
    if (subject) loadThemeList();
  }, [subject]);

  useEffect(() => {
    if (isSolution && theme) loadTestList();
  }, [theme]);

  const loadSubjectList = async () => {
    try {
      const res = await API_SUBJECTS.subjects.list();
      setSubjects(res.data);
    } catch {
      console.error("Ошибка загрузки списка предметов");
    }
  };

  const loadThemeList = async () => {
    try {
      const res = await API_SUBJECTS.themes.getBySubjectId({ id: subject });
      setThemes(res.data);
    } catch {
      console.error("Ошибка загрузки списка тем");
    }
  };

  const loadTestList = async () => {
    try {
      const res = await API_TESTS.tests.list({
        subjectId: subject,
        themeId: theme,
      });
      setTests(res.data.filter((t) => t.author_id !== user?.id));
    } catch {
      console.error("Ошибка загрузки списка тестов");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
          {subjects.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name_subject}
            </MenuItem>
          ))}
        </Select>
        {!isSolution && (
          <CreateForm
            setState={setIsCreateSubject}
            state={isCreateSubject}
            refreshFunc={loadSubjectList}
            asyncFunc={API_SUBJECTS.subjects.add}
          />
        )}
      </FormControl>

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Тема</InputLabel>
        <Select
          value={theme}
          onChange={(e: SelectChangeEvent) => setTheme(e.target.value)}
        >
          {themes.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name_theme}
            </MenuItem>
          ))}
        </Select>
        {!isSolution && subject && (
          <CreateForm
            setState={setIsCreateTheme}
            state={isCreateTheme}
            refreshFunc={loadThemeList}
            asyncFunc={API_SUBJECTS.themes.add}
            payload={subject}
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
            {tests.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                id: {item.id}, автор: {item.author_id}, эксперт:{" "}
                {item.expert_id}, решено {item.times_solved} раз
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
        disabled={!subject || !theme}
      >
        {goToText}
      </Button>
    </Box>
  );
};

export default SelectCourse;
