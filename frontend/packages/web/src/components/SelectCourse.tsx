import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useQuery } from "@apollo/client";
import {
  SUBJECTS_QUERY,
  THEMES_BY_SUBJECT_QUERY,
  TESTS_BY_AUTHOR_QUERY,
} from "@quiz-platform/ui";
import { useAuth } from "@quiz-platform/ui";

interface SelectCourseProps {
  onSelect: (subjectId: string, themeId: string) => void;
}

const SelectCourse = ({ onSelect }: SelectCourseProps) => {
  const [subject, setSubject] = useState("");
  const [theme, setTheme] = useState("");

  const { user } = useAuth();

  const { data: subjectsData } = useQuery(SUBJECTS_QUERY);
  const { data: themesData } = useQuery(THEMES_BY_SUBJECT_QUERY, {
    variables: { subjectId: parseInt(subject) },
    skip: !subject,
  });

  const { data: myTestsData } = useQuery(TESTS_BY_AUTHOR_QUERY as any, {
    variables: { authorId: user?.id || 0 },
    skip: !user?.id,
  });

  const subjects = subjectsData?.subjects || [];
  const themes = themesData?.themesBySubject || [];
  const myTests = myTestsData?.testsByAuthor || [];

  const cards = myTests.filter((t: any) => {
    if (subject && String(t.subjectId) !== String(subject)) return false;
    if (theme && String(t.themeId) !== String(theme)) return false;
    return true;
  });

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    onSelect(subject, theme);
  };

  return (
    <Box sx={{ width: "100%", px: 3, mt: 5 }}>
      <Box sx={{ pt: 3, fontSize: 24, fontWeight: 600 }}>
        Выбор предмета и темы
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mt: 5,
        }}
      >
        <FormControl sx={{ width: 240 }} required>
          <InputLabel sx={{ top: -7 }}>Предмет</InputLabel>
          <Select
            size="small"
            value={subject}
            onChange={(e: SelectChangeEvent) => {
              setSubject(e.target.value);
              setTheme("");
            }}
          >
            {subjects.map((item: any) => (
              <MenuItem key={item.id} value={item.id.toString()}>
                {item.nameSubject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: 240 }} required>
          <InputLabel sx={{ top: -7 }}>Тема</InputLabel>
          <Select
            size="small"
            value={theme}
            onChange={(e: SelectChangeEvent) => setTheme(e.target.value)}
            disabled={!subject}
          >
            {themes.map((item: any) => (
              <MenuItem key={item.id} value={item.id.toString()}>
                {item.nameTheme}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ height: "auto" }}>
          <Button
            variant="contained"
            disabled={!subject || !theme}
            onClick={handleClick}
          >
            Перейти к созданию теста
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ py: 2, fontSize: 24, fontWeight: 600 }}>Мои тесты</Box>

      <Box>
        {cards.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "300px 300px 300px",
              gap: 2,
            }}
          >
            {cards.map((t: any) => (
              <Box
                key={t.id}
                sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2 }}
              >
                <Box sx={{ fontWeight: 700 }}>{t.name || "Без названия"}</Box>
                <Box>id: {t.id}</Box>
                <Box>Вопросов: {t.questionsCount ?? "–"}</Box>
                <Box>Макс. балл: {t.maxPoints}</Box>
                <Box>Прохождений: {t.timesSolved}</Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ color: "text.secondary" }}>
            Нет тестов для выбранных параметров
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SelectCourse;
